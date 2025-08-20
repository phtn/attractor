const fs = require("fs"); // eslint-disable-line
const path = require("path"); // eslint-disable-line

class CodeAnalyzer {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.issues = [];
  }

  // Check for potential memory leak patterns
  analyzeFile(filePath, content) {
    const issues = [];
    const lines = content.split("\n");
    const isReactFile = this.isReactFile(content);

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // Check for event listeners without cleanup
      if (
        this.containsEventListener(trimmedLine) &&
        !this.hasCleanup(content, trimmedLine)
      ) {
        issues.push({
          type: "EVENT_LISTENER_LEAK",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "Event listener added without apparent cleanup",
          severity: "HIGH",
        });
      }

      // Check for timers without cleanup
      if (
        this.containsTimer(trimmedLine) &&
        !this.hasTimerCleanup(content, trimmedLine)
      ) {
        issues.push({
          type: "TIMER_LEAK",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "Timer/interval created without apparent cleanup",
          severity: "HIGH",
        });
      }

      // Check for missing useEffect cleanup (React files only)
      if (isReactFile && this.isUseEffectWithoutCleanup(content, index)) {
        issues.push({
          type: "USEEFFECT_CLEANUP",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "useEffect with side effects may need cleanup function",
          severity: "MEDIUM",
        });
      }

      // Check for large objects in global scope
      if (this.isLargeGlobalObject(trimmedLine)) {
        issues.push({
          type: "GLOBAL_OBJECT",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "Large object in global scope may cause memory retention",
          severity: "MEDIUM",
        });
      }

      // Check for closure memory leaks
      if (this.hasPotentialClosureLeak(trimmedLine)) {
        issues.push({
          type: "CLOSURE_LEAK",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "Potential closure memory leak",
          severity: "LOW",
        });
      }

      // Check for React state mutations
      if (isReactFile && this.hasStateMutation(trimmedLine)) {
        issues.push({
          type: "STATE_MUTATION",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message:
            "Direct state mutation can cause memory leaks and re-render issues",
          severity: "MEDIUM",
        });
      }

      // Check for missing dependency arrays
      if (isReactFile && this.hasMissingDependencies(content, index)) {
        issues.push({
          type: "MISSING_DEPENDENCIES",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "useEffect/useCallback/useMemo missing dependency array",
          severity: "MEDIUM",
        });
      }

      // Check for infinite re-render patterns
      if (isReactFile && this.hasInfiniteRenderPattern(trimmedLine)) {
        issues.push({
          type: "INFINITE_RENDER",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "Pattern that may cause infinite re-renders",
          severity: "HIGH",
        });
      }

      // Check for DOM node references
      if (this.hasDOMNodeReference(trimmedLine)) {
        issues.push({
          type: "DOM_REFERENCE",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "DOM node reference may prevent garbage collection",
          severity: "LOW",
        });
      }
    });

    return issues;
  }

  isReactFile(content) {
    return /import.*react|from ['"]react['"]|useEffect|useState|useCallback/.test(
      content,
    );
  }

  containsEventListener(line) {
    // Only flag actual addEventListener calls, not React event handlers or method assignments
    return /addEventListener|\.on\(/.test(line) &&
      !/^[\s]*on[A-Z]\w*\s*=/.test(line) &&
      !/eventSource\.on|\.onopen\s*=|\.onmessage\s*=|\.onerror\s*=|\.onclose\s*=/.test(line) &&
      !/request\.signal\.addEventListener/.test(line); // SSE abort signal pattern
  }

  hasCleanup(content, eventLine) {
    // More sophisticated cleanup detection
    const eventType = this.extractEventType(eventLine);
    if (eventType) {
      const removePattern = new RegExp(
        `removeEventListener.*${eventType}|cleanup|unmount|useEffect.*return`,
        "i",
      );
      return removePattern.test(content);
    }

    // Check for various cleanup patterns
    const cleanupPatterns = [
      /removeEventListener/,
      /cleanup/i,
      /unmount/i,
      /useEffect.*return/,
      /AbortController/,
      /\.off\(/,
      /\.removeListener/,
      /\.destroy\(/,
      /\.disconnect\(/,
      /clearTimeout|clearInterval/,
      /return\s+unsub/,
      /return\s+\(\s*\)\s*=>/,
      /request\.signal\.addEventListener.*abort/  // SSE cleanup pattern
    ];

    return cleanupPatterns.some(pattern => pattern.test(content));
  }

  extractEventType(line) {
    const match = line.match(/addEventListener\s*\(\s*['"]([^'"]+)['"]/);
    return match ? match[1] : null;
  }

  containsTimer(line) {
    return /setTimeout|setInterval|requestAnimationFrame|requestIdleCallback/.test(
      line,
    );
  }

  hasTimerCleanup(content) {
    return /clearTimeout|clearInterval|cancelAnimationFrame|cancelIdleCallback|AbortController/.test(
      content,
    );
  }

  isUseEffectWithoutCleanup(content, lineIndex) {
    const lines = content.split("\n");
    const line = lines[lineIndex];

    if (!/useEffect/.test(line)) return false;

    // Look ahead to see if there's a return statement for cleanup
    let braceCount = 0;
    let hasReturn = false;
    let hasSideEffects = false;

    for (let i = lineIndex; i < Math.min(lineIndex + 30, lines.length); i++) {
      const currentLine = lines[i];
      braceCount += (currentLine.match(/{/g) || []).length;
      braceCount -= (currentLine.match(/}/g) || []).length;

      // Check for cleanup return
      if (
        /return\s*\(\s*\)\s*=>|return\s*function|return\s*\(\s*\)\s*{/.test(
          currentLine,
        )
      ) {
        hasReturn = true;
      }

      // Check for side effects that need cleanup (exclude simple fetch calls)
      if (
        /addEventListener|setInterval|setTimeout|subscribe|WebSocket|EventSource|XMLHttpRequest/.test(
          currentLine,
        ) && !/await\s+fetch\(/.test(currentLine)
      ) {
        hasSideEffects = true;
      }

      if (braceCount < 0) break;
    }

    // Check for cleanup patterns that indicate proper cleanup
    let hasCleanupPatterns = false;
    for (let i = lineIndex; i < Math.min(lineIndex + 50, lines.length); i++) {
      const currentLine = lines[i];
      if (/\.destroy\(\)|\.close\(\)|\.disconnect\(\)|removeEventListener|clearTimeout|clearInterval|\.off\(|unsub\(\)|unsubscribe\(\)|return\s+unsub/.test(currentLine)) {
        hasCleanupPatterns = true;
        break;
      }
    }

    // Only flag if there are side effects but no return AND no cleanup patterns
    return hasSideEffects && !hasReturn && !hasCleanupPatterns;
  }

  hasStateMutation(line) {
    // Check for direct state mutations
    return (
      /\w+\.push\(|\w+\.pop\(|\w+\.splice\(|\w+\[\w+\]\s*=|Object\.assign\s*\(\s*\w+/.test(
        line,
      ) && /state|State/.test(line)
    );
  }

  hasMissingDependencies(content, lineIndex) {
    const lines = content.split("\n");
    const line = lines[lineIndex];

    if (!/useEffect|useCallback|useMemo/.test(line)) return false;

    // Look for dependency array
    let foundDependencyArray = false;
    for (let i = lineIndex; i < Math.min(lineIndex + 10, lines.length); i++) {
      if (/\[\s*\]|\[.*\]/.test(lines[i])) {
        foundDependencyArray = true;
        break;
      }
    }

    return !foundDependencyArray;
  }

  hasInfiniteRenderPattern(line) {
    // Patterns that commonly cause infinite re-renders
    return (
      /useEffect\s*\(\s*[^,]*,\s*\[.*\{\}.*\]|useEffect\s*\(\s*[^,]*,\s*\[.*new\s+/.test(
        line,
      ) || /useState\s*\(\s*\{\}|\[\s*\{\}|\[\s*\[\]/.test(line)
    );
  }

  hasDOMNodeReference(line) {
    return /document\.|window\.|\.current\s*=\s*document|\.current\s*=\s*window|querySelector|getElementById/.test(
      line,
    );
  }

  isLargeGlobalObject(line) {
    // Check for global variables that might accumulate data
    return (
      /^(window\.|global\.|globalThis\.)?\w+\s*=\s*\[/.test(line) ||
      /^(window\.|global\.|globalThis\.)?\w+\s*=\s*{/.test(line) ||
      /^(window\.|global\.|globalThis\.)?\w+\s*=\s*new\s+(Array|Object|Map|Set)/.test(
        line,
      )
    );
  }

  hasPotentialClosureLeak(line) {
    // Look for closures that might retain references
    return /function.*\{.*\}/.test(line) && /document|window|global/.test(line);
  }

  // Scan all relevant files
  async scanDirectory(dir = this.rootDir) {
    const files = await this.getReactFiles(dir);

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, "utf8");
        const fileIssues = this.analyzeFile(file, content);
        this.issues.push(...fileIssues);
      } catch (error) {
        console.error(`Error reading file ${file}:`, error.message);
      }
    }
  }

  // Get all React/JS/TS files
  async getReactFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
        files.push(...(await this.getReactFiles(fullPath)));
      } else if (entry.isFile() && this.isRelevantFile(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  shouldSkipDirectory(name) {
    return ["node_modules", ".next", ".git", "dist", "build"].includes(name);
  }

  isRelevantFile(name) {
    return /\.(js|jsx|ts|tsx)$/.test(name);
  }

  // Generate report
  generateReport() {
    console.log("🔍 CODE ANALYSIS REPORT FOR MEMORY LEAKS");
    console.log("=".repeat(60));

    if (this.issues.length === 0) {
      console.log("✅ No obvious memory leak patterns detected in code!");
      this.generateSummaryTable([], {});
      return;
    }

    // Group issues by severity and type
    const bySeverity = this.groupBySeverity();
    const byType = this.groupByType();

    console.log(`📊 Found ${this.issues.length} potential issues:\n`);

    // Show severity summary
    console.log("🚨 SEVERITY BREAKDOWN:");
    Object.keys(bySeverity).forEach((severity) => {
      const count = bySeverity[severity].length;
      const icon = this.getSeverityIcon(severity);
      console.log(`   ${icon} ${severity}: ${count} issues`);
    });
    console.log("");

    // Show high severity issues first
    ["HIGH", "MEDIUM", "LOW"].forEach((severity) => {
      if (!bySeverity[severity] || bySeverity[severity].length === 0) return;

      console.log(
        `${this.getSeverityIcon(severity)} ${severity} PRIORITY ISSUES:`,
      );

      const typeGroups = bySeverity[severity].reduce((acc, issue) => {
        if (!acc[issue.type]) acc[issue.type] = [];
        acc[issue.type].push(issue);
        return acc;
      }, {});

      Object.keys(typeGroups).forEach((type) => {
        const issues = typeGroups[type];
        console.log(
          `  ${this.getTypeIcon(type)} ${this.getTypeDescription(type)} (${issues.length}):`,
        );

        issues.slice(0, 3).forEach((issue) => {
          const relativePath = path.relative(this.rootDir, issue.file);
          console.log(`     📁 ${relativePath}:${issue.line}`);
          console.log(`     💡 ${issue.message}`);
          console.log(
            `     📄 ${issue.code.substring(0, 70)}${issue.code.length > 70 ? "..." : ""}`,
          );
          console.log("");
        });

        if (issues.length > 3) {
          console.log(
            `     ... and ${issues.length - 3} more similar issues\n`,
          );
        }
      });
    });

    console.log("💡 RECOMMENDATIONS:");
    this.generateRecommendations(byType);

    // Generate summary statistics
    this.generateStatistics();

    // Generate summary table at the end
    this.generateSummaryTable(bySeverity, byType);
  }

  groupBySeverity() {
    return this.issues.reduce((acc, issue) => {
      if (!acc[issue.severity]) acc[issue.severity] = [];
      acc[issue.severity].push(issue);
      return acc;
    }, {});
  }

  groupByType() {
    return this.issues.reduce((acc, issue) => {
      if (!acc[issue.type]) acc[issue.type] = [];
      acc[issue.type].push(issue);
      return acc;
    }, {});
  }

  getSeverityIcon(severity) {
    const icons = {
      HIGH: "🔴",
      MEDIUM: "🟡",
      LOW: "🟢",
    };
    return icons[severity] || "⚪";
  }

  getTypeIcon(type) {
    const icons = {
      EVENT_LISTENER_LEAK: "👂",
      TIMER_LEAK: "⏰",
      USEEFFECT_CLEANUP: "⚛️",
      GLOBAL_OBJECT: "🌍",
      CLOSURE_LEAK: "🔒",
      STATE_MUTATION: "🔄",
      MISSING_DEPENDENCIES: "📦",
      INFINITE_RENDER: "♾️",
      DOM_REFERENCE: "🏗️",
    };
    return icons[type] || "❓";
  }

  getTypeDescription(type) {
    const descriptions = {
      EVENT_LISTENER_LEAK: "Event Listener Leaks",
      TIMER_LEAK: "Timer/Interval Leaks",
      USEEFFECT_CLEANUP: "useEffect Cleanup Issues",
      GLOBAL_OBJECT: "Global Object Issues",
      CLOSURE_LEAK: "Potential Closure Leaks",
      STATE_MUTATION: "State Mutation Issues",
      MISSING_DEPENDENCIES: "Missing Dependencies",
      INFINITE_RENDER: "Infinite Render Patterns",
      DOM_REFERENCE: "DOM Reference Issues",
    };
    return descriptions[type] || "Unknown Issue";
  }

  generateRecommendations(grouped) {
    if (grouped["EVENT_LISTENER_LEAK"]) {
      console.log(
        "   Event Listeners: Add removeEventListener in cleanup functions or use AbortController",
      );
    }
    if (grouped["TIMER_LEAK"]) {
      console.log(
        "    Timers: Use clearTimeout/clearInterval in cleanup or AbortController for fetch",
      );
    }
    if (grouped["USEEFFECT_CLEANUP"]) {
      console.log("   useEffect: Return cleanup functions for side effects");
    }
    if (grouped["GLOBAL_OBJECT"]) {
      console.log("   Global Objects: Consider local scope or proper cleanup");
    }
    if (grouped["CLOSURE_LEAK"]) {
      console.log("   Closures: Avoid capturing large objects unnecessarily");
    }
    if (grouped["STATE_MUTATION"]) {
      console.log(
        "   State Mutations: Use immutable updates with spread operator or immer",
      );
    }
    if (grouped["MISSING_DEPENDENCIES"]) {
      console.log("   Dependencies: Add proper dependency arrays to hooks");
    }
    if (grouped["INFINITE_RENDER"]) {
      console.log(
        "   ♾️  Infinite Renders: Use useMemo/useCallback for object/array dependencies",
      );
    }
    if (grouped["DOM_REFERENCE"]) {
      console.log(
        "   🏗️  DOM References: Use refs properly and clean up manual DOM references",
      );
    }

    console.log("\n🔧 General Tips:");
    console.log("   • Use React DevTools Profiler to identify re-renders");
    console.log("   • Monitor component mount/unmount cycles");
    console.log("   • Use WeakMap/WeakSet for temporary object references");
    console.log("   • Implement proper cleanup in component lifecycle methods");
    console.log("   • Consider using React.memo() for expensive components");
    console.log("   • Use AbortController for cancellable async operations");
  }

  generateSummaryTable(bySeverity, byType) {
    console.log("📋 MEMORY LEAK ANALYSIS SUMMARY");
    console.log("─".repeat(95));

    // Header with better spacing like your example
    const header = [
      "Issue Type".padEnd(25),
      "Count".padEnd(8),
      "% Critical".padEnd(12),
      "Severity".padEnd(15),
      "Files".padEnd(8),
      "Status".padEnd(12)
    ].join(" ");

    console.log(header);
    console.log("─".repeat(95));

    // Get all issue types
    const allTypes = Object.keys(byType);

    if (allTypes.length === 0) {
      const row = [
        "No issues detected".padEnd(25),
        "0/0".padEnd(8),
        "0%".padEnd(12),
        "-".padEnd(15),
        "-".padEnd(8),
        "✅ CLEAN".padEnd(12)
      ].join(" ");
      console.log(row);
      console.log("─".repeat(95));
      console.log("");
      return;
    } else {
      allTypes.forEach(type => {
        const issues = byType[type];
        const high = issues.filter(i => i.severity === 'HIGH').length;
        const medium = issues.filter(i => i.severity === 'MEDIUM').length;
        const low = issues.filter(i => i.severity === 'LOW').length;
        const total = issues.length;

        // Calculate percentage of critical (HIGH) issues
        const criticalPercent = total > 0 ? Math.round((high / total) * 100) : 0;

        // Get unique files affected
        const uniqueFiles = new Set(issues.map(i => i.file)).size;

        // Determine status
        let status = "🟢 LOW";
        if (high > 0) status = "🔴 HIGH";
        else if (medium > 0) status = "🟡 MED";

        // Get severity breakdown
        const severityBreakdown = `H:${high} M:${medium} L:${low}`;

        const typeName = this.getTypeDescription(type);
        const shortName = typeName.length > 25 ? typeName.substring(0, 22) + "..." : typeName;

        const row = [
          shortName.padEnd(25),
          `${high + medium}/${total}`.padEnd(8),
          `${criticalPercent}%`.padEnd(12),
          severityBreakdown.padEnd(15),
          uniqueFiles.toString().padEnd(8),
          status.padEnd(12)
        ].join(" ");

        console.log(row);
      });
    }

    console.log("─".repeat(95));

    // Totals row
    const totalHigh = (bySeverity.HIGH || []).length;
    const totalMedium = (bySeverity.MEDIUM || []).length;
    const totalLow = (bySeverity.LOW || []).length;
    const grandTotal = this.issues.length;
    const totalCriticalPercent = grandTotal > 0 ? Math.round((totalHigh / grandTotal) * 100) : 0;
    const totalFiles = new Set(this.issues.map(i => i.file)).size;

    let overallStatus = "🟢 GOOD";
    if (totalHigh > 0) overallStatus = "🔴 NEEDS FIX";
    else if (totalMedium > 0) overallStatus = "🟡 REVIEW";

    const totalRow = [
      "TOTAL".padEnd(25),
      `${totalHigh + totalMedium}/${grandTotal}`.padEnd(8),
      `${totalCriticalPercent}%`.padEnd(12),
      `H:${totalHigh} M:${totalMedium} L:${totalLow}`.padEnd(15),
      totalFiles.toString().padEnd(8),
      overallStatus.padEnd(12)
    ].join(" ");

    console.log(totalRow);
    console.log("─".repeat(95));
    console.log("");
  }

  getTypeShortDescription(type) {
    const descriptions = {
      EVENT_LISTENER_LEAK: "DOM event cleanup",
      TIMER_LEAK: "Timer cleanup",
      USEEFFECT_CLEANUP: "React cleanup",
      GLOBAL_OBJECT: "Global scope",
      CLOSURE_LEAK: "Closure refs",
      STATE_MUTATION: "State mutations",
      MISSING_DEPENDENCIES: "Hook deps",
      INFINITE_RENDER: "Render loops",
      DOM_REFERENCE: "DOM refs",
    };
    return descriptions[type] || "Unknown";
  }

  generateStatistics() {
    const fileCount = new Set(this.issues.map((issue) => issue.file)).size;
    const bySeverity = this.groupBySeverity();

    console.log("📈 DETAILED STATISTICS:");
    console.log(`   📁 Files scanned: ${fileCount}`);
    console.log(
      `   🔴 Critical issues: ${(bySeverity.HIGH || []).length}`,
    );
    console.log(
      `   🟡 Medium issues: ${(bySeverity.MEDIUM || []).length}`,
    );
    console.log(`   🟢 Low priority: ${(bySeverity.LOW || []).length}`);

    // Most problematic files
    const fileIssueCount = this.issues.reduce((acc, issue) => {
      const relativePath = path.relative(this.rootDir, issue.file);
      acc[relativePath] = (acc[relativePath] || 0) + 1;
      return acc;
    }, {});

    const topFiles = Object.entries(fileIssueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (topFiles.length > 0) {
      console.log("\n🎯 FILES NEEDING ATTENTION:");
      topFiles.forEach(([file, count]) => {
        console.log(`   📁 ${file}: ${count} issues`);
      });
    }
  }
  saveDetailedReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      rootDir: this.rootDir,
      totalIssues: this.issues.length,
      issuesBySeverity: this.groupBySeverity(),
      issuesByType: this.groupByType(),
      issues: this.issues.map((issue) => ({
        ...issue,
        file: path.relative(this.rootDir, issue.file),
      })),
    };

    const filename = `code-analysis-report-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
    console.log(`\nDetailed report saved to: ${filename}`);
  }

  // Quick scan for specific patterns
  quickScan(
    patterns = ["EVENT_LISTENER_LEAK", "TIMER_LEAK", "USEEFFECT_CLEANUP"],
  ) {
    console.log(`🔍 Quick scan for: ${patterns.join(", ")}\n`);

    const filteredIssues = this.issues.filter((issue) =>
      patterns.includes(issue.type),
    );

    if (filteredIssues.length === 0) {
      console.log("✅ No critical issues found for specified patterns!");
      // Generate empty summary table
      this.generateSummaryTable({}, {});
      return;
    }

    console.log(`🔍 DETAILED FINDINGS (${filteredIssues.length} issues):`);
    filteredIssues.forEach((issue) => {
      const relativePath = path.relative(this.rootDir, issue.file);
      console.log(
        `${this.getSeverityIcon(issue.severity)} ${relativePath}:${issue.line} - ${issue.message}`,
      );
    });

    // Generate summary table at the end for quick scan
    const quickBySeverity = filteredIssues.reduce((acc, issue) => {
      if (!acc[issue.severity]) acc[issue.severity] = [];
      acc[issue.severity].push(issue);
      return acc;
    }, {});

    const quickByType = filteredIssues.reduce((acc, issue) => {
      if (!acc[issue.type]) acc[issue.type] = [];
      acc[issue.type].push(issue);
      return acc;
    }, {});

    console.log("\n");
    this.generateSummaryTable(quickBySeverity, quickByType);
  }

  // Run analysis if script is executed directly
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const saveReport = args.includes("--save");
  const quickMode = args.includes("--quick");
  const targetDir = args.find((arg) => !arg.startsWith("--")) || process.cwd();

  console.log("🔍 Code Pattern Analyzer for Memory Leaks");
  console.log(
    "Usage: bun analyze-code-patterns.cjs [directory] [--save] [--quick]",
  );
  console.log("Example: bun analyze-code-patterns.cjs src --save\n");

  const analyzer = new CodeAnalyzer(targetDir);

  console.log(`🔍 Scanning ${targetDir} for memory leak patterns...\n`);

  analyzer
    .scanDirectory()
    .then(() => {
      if (quickMode) {
        analyzer.quickScan();
      } else {
        analyzer.generateReport();
      }

      if (saveReport) {
        analyzer.saveDetailedReport();
      }
    })
    .catch((error) => {
      console.error("Error during analysis:", error);
    });
}
// Save detailed report to file

module.exports = CodeAnalyzer;
