const fs = require("fs"); // eslint-disable-line

// Memory monitoring utility
class MemoryMonitor {
  constructor(processName = "next dev") {
    this.processName = processName;
    this.measurements = [];
    this.startTime = Date.now();
  }

  // Get current memory usage
  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      timestamp: Date.now(),
      rss: usage.rss, // Resident Set Size
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers,
    };
  }

  // Format bytes to human readable format
  formatBytes(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }

  // Check for potential memory leaks
  analyzeMeasurements() {
    if (this.measurements.length < 3) {
      return { hasLeak: false, message: "Insufficient data for analysis" };
    }

    const recent = this.measurements.slice(-10); // Last 10 measurements
    const heapTrend = this.calculateTrend(recent.map((m) => m.heapUsed));
    const rssTrend = this.calculateTrend(recent.map((m) => m.rss));

    // If heap or RSS is consistently growing by more than 5MB per measurement
    const LEAK_THRESHOLD = 5 * 1024 * 1024; // 5MB

    const analysis = {
      heapTrend:
        heapTrend > LEAK_THRESHOLD
          ? "INCREASING"
          : heapTrend < -LEAK_THRESHOLD
            ? "DECREASING"
            : "STABLE",
      rssTrend:
        rssTrend > LEAK_THRESHOLD
          ? "INCREASING"
          : rssTrend < -LEAK_THRESHOLD
            ? "DECREASING"
            : "STABLE",
      hasLeak: heapTrend > LEAK_THRESHOLD || rssTrend > LEAK_THRESHOLD,
      heapGrowthRate: this.formatBytes(heapTrend),
      rssGrowthRate: this.formatBytes(rssTrend),
    };

    return analysis;
  }

  // Calculate trend (average change per measurement)
  calculateTrend(values) {
    if (values.length < 2) return 0;

    let sum = 0;
    for (let i = 1; i < values.length; i++) {
      sum += values[i] - values[i - 1];
    }

    return sum / (values.length - 1);
  }

  // Start monitoring
  startMonitoring(intervalMs = 2000, maxMeasurements = 30) {
    console.log(`🔍 Starting memory monitoring for ${this.processName}...`);
    console.log(
      `📊 Taking measurements every ${intervalMs}ms for ${maxMeasurements} iterations\n`,
    );

    let count = 0;
    const interval = setInterval(() => {
      const measurement = this.getMemoryUsage();
      this.measurements.push(measurement);

      const elapsed = (measurement.timestamp - this.startTime) / 1000;

      console.log(
        `📈 Measurement ${count + 1}/${maxMeasurements} (${elapsed.toFixed(1)}s):`,
      );
      console.log(`   RSS: ${this.formatBytes(measurement.rss)}`);
      console.log(`   Heap Used: ${this.formatBytes(measurement.heapUsed)}`);
      console.log(`   Heap Total: ${this.formatBytes(measurement.heapTotal)}`);
      console.log(`   External: ${this.formatBytes(measurement.external)}`);

      if (count > 2) {
        const analysis = this.analyzeMeasurements();
        if (analysis.hasLeak) {
          console.log(`   ⚠️  POTENTIAL LEAK DETECTED!`);
          console.log(
            `   📈 Heap Growth Rate: ${analysis.heapGrowthRate}/measurement`,
          );
          console.log(
            `   📈 RSS Growth Rate: ${analysis.rssGrowthRate}/measurement`,
          );
        } else {
          console.log(`   ✅ Memory usage appears stable`);
        }
      }

      console.log("");

      count++;
      if (count >= maxMeasurements) {
        clearInterval(interval);
        this.generateReport();
      }
    }, intervalMs);
  }

  // Generate final report
  generateReport() {
    console.log("🎯 MEMORY ANALYSIS REPORT");
    console.log("=".repeat(50));

    if (this.measurements.length === 0) {
      console.log("❌ No measurements collected");
      return;
    }

    const first = this.measurements[0];
    const last = this.measurements[this.measurements.length - 1];
    const analysis = this.analyzeMeasurements();

    console.log(`📊 Total Measurements: ${this.measurements.length}`);
    console.log(
      `⏱️  Duration: ${((last.timestamp - first.timestamp) / 1000).toFixed(1)}s`,
    );
    console.log("");

    console.log("📈 MEMORY CHANGES:");
    console.log(
      `   RSS: ${this.formatBytes(first.rss)} → ${this.formatBytes(last.rss)} (${this.formatBytes(last.rss - first.rss)})`,
    );
    console.log(
      `   Heap Used: ${this.formatBytes(first.heapUsed)} → ${this.formatBytes(last.heapUsed)} (${this.formatBytes(last.heapUsed - first.heapUsed)})`,
    );
    console.log(
      `   Heap Total: ${this.formatBytes(first.heapTotal)} → ${this.formatBytes(last.heapTotal)} (${this.formatBytes(last.heapTotal - first.heapTotal)})`,
    );
    console.log("");

    console.log("🔍 LEAK ANALYSIS:");
    console.log(
      `   Status: ${analysis.hasLeak ? "❌ POTENTIAL LEAK DETECTED" : "✅ NO LEAK DETECTED"}`,
    );
    console.log(
      `   Heap Trend: ${analysis.heapTrend} (${analysis.heapGrowthRate}/measurement)`,
    );
    console.log(
      `   RSS Trend: ${analysis.rssTrend} (${analysis.rssGrowthRate}/measurement)`,
    );

    if (analysis.hasLeak) {
      console.log("");
      console.log("💡 RECOMMENDATIONS:");
      console.log("   1. Check for event listeners that are not being removed");
      console.log(
        "   2. Look for closures holding references to large objects",
      );
      console.log("   3. Verify timers/intervals are being cleared");
      console.log("   4. Check for global variables accumulating data");
      console.log(
        "   5. Review React components for missing cleanup in useEffect",
      );
    }

    // Save detailed data
    this.saveDetailedReport();
  }

  // Save detailed report to file
  saveDetailedReport() {
    const reportData = {
      processName: this.processName,
      startTime: this.startTime,
      measurements: this.measurements,
      analysis: this.analyzeMeasurements(),
    };

    const filename = `memory-report-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
    console.log(`\n💾 Detailed report saved to: ${filename}`);
  }
}

// Start monitoring if this script is run directly
if (require.main === module) {
  const monitor = new MemoryMonitor("Next.js Dev Server");
  monitor.startMonitoring(2000, 20); // Every 2 seconds, 20 measurements (40 seconds total)
}

module.exports = MemoryMonitor;
