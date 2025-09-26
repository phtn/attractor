import { PullRequestEventPayload } from '@/app/types'
import { ReviewData } from '@/app/types/webhooks'

// GitHub API types for fetching additional data
interface GitHubFile {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string; // The actual diff content
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  files?: GitHubFile[];
}

export const handlePullRequestEvent = async (
  payload: PullRequestEventPayload,
  githubToken: string
): Promise<void> => {
  // Only process opened, synchronize (new commits), or reopened PRs
  if (!['opened', 'synchronize', 'reopened'].includes(payload.action)) {
    console.log(`Ignoring PR action: ${payload.action}`)
    return
  }

  const { pull_request: pr, repository: repo } = payload
  console.log(
    `Pull request ${payload.action} for ${payload.repository.full_name}`
  )
  console.log(`Processing #${pr.number}: ${pr.title}`)

  try {
    // Step 1: Get the files changed in this PR
    const changedFiles = await getChangedFiles(
      repo.owner.login,
      repo.name,
      pr.number,
      githubToken
    )

    // Step 2: Get the actual file contents and diffs
    const fileContents = await getFileContentsWithDiffs(
      changedFiles,
      githubToken
    )

    // Step 3: Prepare data for LLM review
    const reviewData = prepareReviewData(pr, repo, fileContents)

    // Step 4: Send to your LLM agent for review
    const review = await performLLMCodeReview(reviewData)

    // Step 5: Post the review back to GitHub
    await postReviewToGitHub(
      repo.owner.login,
      repo.name,
      pr.number,
      review,
      githubToken
    )
  } catch (error) {
    console.error('Error processing PR:', error)
  }
}

// Fetch the list of changed files in the PR
// https://api.github.com/repos/WebKit/WebKit/pulls/47027/files
async function getChangedFiles (
  owner: string,
  repo: string,
  prNumber: number,
  token: string
): Promise<GitHubFile[]> {
  const response = await fetch(
    // `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    'https://api.github.com/repos/WebKit/WebKit/pulls/47027/files',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch PR files: ${response.statusText}`)
  }

  return response.json() as Promise<GitHubFile[]>
}

// Get file contents with diffs for LLM analysis
async function getFileContentsWithDiffs (
  files: GitHubFile[],
  token: string
): Promise<
  Array<{
    filename: string;
    status: string;
    patch: string;
    fullContent?: string;
  }>
> {
  const fileContents = await Promise.all(
    files.map(async (file) => {
      try {
        // Get the raw content of the file (current version)
        let fullContent: string | undefined
        if (file.status !== 'removed' && file.raw_url) {
          const contentResponse = await fetch(file.raw_url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (contentResponse.ok) {
            fullContent = await contentResponse.text()
          }
        }

        return {
          filename: file.filename,
          status: file.status,
          patch: file.patch ?? '',
          fullContent,
          additions: file.additions,
          deletions: file.deletions,
        }
      } catch (error) {
        console.error(`Error fetching content for ${file.filename}:`, error)
        return {
          filename: file.filename,
          status: file.status,
          patch: file.patch ?? '',
        }
      }
    })
  )

  return fileContents
}

function prepareReviewData (
  pr: PullRequestEventPayload['pull_request'],
  repo: PullRequestEventPayload['repository'],
  fileContents: Array<{
    filename: string;
    status: string;
    patch: string;
    fullContent?: string;
    additions?: number;
    deletions?: number;
  }>
): ReviewData {
  return {
    prInfo: {
      title: pr.title,
      description: pr.body ?? '',
      author: pr.user.login,
      number: pr.number,
    },
    repository: {
      name: repo.name,
      owner: repo.owner.login,
    },
    changes: fileContents.map((file) => ({
      filename: file.filename,
      status: file.status,
      diff: file.patch,
      fullContent: file.fullContent,
      stats: {
        additions: file.additions ?? 0,
        deletions: file.deletions ?? 0,
      },
    })),
  }
}

// Send the prepared data to your LLM for code review
async function performLLMCodeReview (reviewData: ReviewData): Promise<string> {
  // This is where you'd integrate with your LLM service
  // Example payload structure for your LLM:

  const llmPrompt = `
Please review this pull request:

**PR Info:**
- Title: ${reviewData.prInfo.title}
- Author: ${reviewData.prInfo.author}
- Description: ${reviewData.prInfo.description}

**Changed Files:**
${reviewData.changes
  .map(
    (change) => `
### ${change.filename} (${change.status})
**Stats:** +${change.stats.additions} -${change.stats.deletions}

**Diff:**
\`\`\`diff
${change.diff}
\`\`\`

${
  change.fullContent
    ? `**Full File Content:**
\`\`\`
${change.fullContent}
\`\`\``
    : ''
}
`
  )
  .join('\n')}

Please provide:
1. Overall assessment
2. Specific issues or suggestions
3. Code quality feedback
4. Security considerations
5. Performance implications

Format your response in markdown.
  `

  // Replace with your actual LLM API call
  // Example with OpenAI:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Provide constructive feedback on code changes.',
        },
        {
          role: 'user',
          content: llmPrompt,
        },
      ],
      max_tokens: 2000,
    }),
  });
  */

  console.log(llmPrompt.length)
  console.log('FILE CHANGES', reviewData.changes.length)
  reviewData.changes.flatMap((file) =>
    console.log('FILE NAMES', file.filename)
  )

  // Mock response for example
  return `## Code Review Summary

✅ **Overall Assessment:** Good changes with minor suggestions

### Key Findings:
1. Code follows established patterns
2. No obvious security issues detected
3. Consider adding error handling in the new functions

### Specific Suggestions:
- Add type annotations where missing
- Consider extracting magic numbers to constants
- Add unit tests for new functionality

Great work on this PR! 🚀`
}
// Post the review back to GitHub as a PR comment
async function postReviewToGitHub (
  owner: string,
  repo: string,
  prNumber: number,
  reviewContent: string,
  token: string
): Promise<void> {
  // await postReview(owner, repo, prNumber, reviewContent, token)

  console.log(owner, repo, prNumber, reviewContent, token)
  console.log(`Posted review for PR #${prNumber}`)
}

export const postReview = async (
  owner: string,
  repo: string,
  prNumber: number,
  reviewContent: string,
  token: string
) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: `## 🤖 AI Code Review\n\n${reviewContent}`,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to post review: ${response.statusText}`)
  }
}
