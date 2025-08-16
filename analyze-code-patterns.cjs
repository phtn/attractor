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
        });
      }

      // Check for missing useEffect cleanup
      if (this.isUseEffectWithoutCleanup(content, index)) {
        issues.push({
          type: "USEEFFECT_CLEANUP",
          file: filePath,
          line: lineNum,
          code: trimmedLine,
          message: "useEffect with side effects may need cleanup function",
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
        });
      }
    });

    return issues;
  }

  containsEventListener(line) {
    return /addEventListener|on[A-Z]\w*\s*=/.test(line);
  }

  hasCleanup(content) {
    // Look for removeEventListener or cleanup patterns
    return /removeEventListener|cleanup|unmount|useEffect.*return/.test(
      content,
    );
  }

  containsTimer(line) {
    return /setTimeout|setInterval|requestAnimationFrame/.test(line);
  }

  hasTimerCleanup(content) {
    return /clearTimeout|clearInterval|cancelAnimationFrame/.test(content);
  }

  isUseEffectWithoutCleanup(content, lineIndex) {
    const lines = content.split("\n");
    const line = lines[lineIndex];

    if (!/useEffect/.test(line)) return false;

    // Look ahead to see if there's a return statement for cleanup
    let braceCount = 0;
    let hasReturn = false;

    for (let i = lineIndex; i < Math.min(lineIndex + 20, lines.length); i++) {
      const currentLine = lines[i];
      braceCount += (currentLine.match(/{/g) || []).length;
      braceCount -= (currentLine.match(/}/g) || []).length;

      if (/return\s*\(\s*\)\s*=>|return\s*function/.test(currentLine)) {
        hasReturn = true;
        break;
      }

      if (braceCount < 0) break;
    }

    // Check if useEffect has dependencies that might need cleanup
    const hasDependencies =
      /addEventListener|setInterval|setTimeout|subscribe/.test(content);

    return hasDependencies && !hasReturn;
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
      return;
    }

    // Group issues by type
    const grouped = this.issues.reduce((acc, issue) => {
      if (!acc[issue.type]) acc[issue.type] = [];
      acc[issue.type].push(issue);
      return acc;
    }, {});

    console.log(`📊 Found ${this.issues.length} potential issues:\n`);

    Object.keys(grouped).forEach((type) => {
      const issues = grouped[type];
      console.log(
        `${this.getTypeIcon(type)} ${this.getTypeDescription(type)} (${issues.length} issues):`,
      );

      issues.slice(0, 5).forEach((issue) => {
        // Show first 5 of each type
        const relativePath = path.relative(this.rootDir, issue.file);
        console.log(`   📁 ${relativePath}:${issue.line}`);
        console.log(`   💡 ${issue.message}`);
        console.log(
          `   📄 ${issue.code.substring(0, 80)}${issue.code.length > 80 ? "..." : ""}`,
        );
        console.log("");
      });

      if (issues.length > 5) {
        console.log(`   ... and ${issues.length - 5} more similar issues\n`);
      }
    });

    console.log("💡 RECOMMENDATIONS:");
    this.generateRecommendations(grouped);
  }

  getTypeIcon(type) {
    const icons = {
      EVENT_LISTENER_LEAK: "👂",
      TIMER_LEAK: "⏰",
      USEEFFECT_CLEANUP: "⚛️",
      GLOBAL_OBJECT: "🌍",
      CLOSURE_LEAK: "🔒",
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
    };
    return descriptions[type] || "Unknown Issue";
  }

  generateRecommendations(grouped) {
    if (grouped["EVENT_LISTENER_LEAK"]) {
      console.log(
        "   👂 Event Listeners: Add removeEventListener in cleanup functions",
      );
    }
    if (grouped["TIMER_LEAK"]) {
      console.log("   ⏰ Timers: Use clearTimeout/clearInterval in cleanup");
    }
    if (grouped["USEEFFECT_CLEANUP"]) {
      console.log(
        "   ⚛️  useEffect: Return cleanup functions for side effects",
      );
    }
    if (grouped["GLOBAL_OBJECT"]) {
      console.log(
        "   🌍 Global Objects: Consider local scope or proper cleanup",
      );
    }
    if (grouped["CLOSURE_LEAK"]) {
      console.log(
        "   🔒 Closures: Avoid capturing large objects unnecessarily",
      );
    }

    console.log("\n🔧 General Tips:");
    console.log("   • Use React DevTools Profiler to identify re-renders");
    console.log("   • Monitor component mount/unmount cycles");
    console.log("   • Use WeakMap/WeakSet for temporary object references");
    console.log("   • Implement proper cleanup in component lifecycle methods");
  }
}

// Run analysis if script is executed directly
if (require.main === module) {
  const analyzer = new CodeAnalyzer(process.cwd());

  console.log("🔍 Scanning codebase for memory leak patterns...\n");

  analyzer
    .scanDirectory()
    .then(() => {
      analyzer.generateReport();
    })
    .catch((error) => {
      console.error("❌ Error during analysis:", error);
    });
}

module.exports = CodeAnalyzer;
