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

    // Dynamic threshold based on current memory usage
    const avgHeapUsed =
      recent.reduce((sum, m) => sum + m.heapUsed, 0) / recent.length;
    const LEAK_THRESHOLD = Math.max(5 * 1024 * 1024, avgHeapUsed * 0.05); // 5MB or 5% of current usage

    // Check for consistent growth pattern (not just spikes)
    const consistentGrowth = this.checkConsistentGrowth(
      recent.map((m) => m.heapUsed),
    );
    const memoryPressure = this.calculateMemoryPressure(recent);

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
      hasLeak:
        (heapTrend > LEAK_THRESHOLD && consistentGrowth) ||
        rssTrend > LEAK_THRESHOLD,
      heapGrowthRate: this.formatBytes(heapTrend),
      rssGrowthRate: this.formatBytes(rssTrend),
      consistentGrowth,
      memoryPressure,
      gcEfficiency: this.calculateGCEfficiency(recent),
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

  // Check if memory growth is consistent (not just GC spikes)
  checkConsistentGrowth(values) {
    if (values.length < 5) return false;

    let growthCount = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) growthCount++;
    }

    // Consider it consistent if 70% of measurements show growth
    return growthCount / (values.length - 1) > 0.7;
  }

  // Calculate memory pressure indicators
  calculateMemoryPressure(measurements) {
    const latest = measurements[measurements.length - 1];
    const heapUtilization = latest.heapUsed / latest.heapTotal;
    const externalRatio = latest.external / latest.heapUsed;

    return {
      heapUtilization: Math.round(heapUtilization * 100),
      externalRatio: Math.round(externalRatio * 100),
      pressure:
        heapUtilization > 0.8
          ? "HIGH"
          : heapUtilization > 0.6
            ? "MEDIUM"
            : "LOW",
    };
  }

  // Estimate GC efficiency by looking at heap total vs used patterns
  calculateGCEfficiency(measurements) {
    if (measurements.length < 3) return "UNKNOWN";

    let gcEvents = 0;
    let totalReclaimed = 0;

    for (let i = 1; i < measurements.length; i++) {
      const prev = measurements[i - 1];
      const curr = measurements[i];

      // Detect potential GC event (heap used drops significantly)
      if (prev.heapUsed - curr.heapUsed > 1024 * 1024) {
        // 1MB drop
        gcEvents++;
        totalReclaimed += prev.heapUsed - curr.heapUsed;
      }
    }

    const avgReclaimed = gcEvents > 0 ? totalReclaimed / gcEvents : 0;
    return {
      events: gcEvents,
      avgReclaimed: this.formatBytes(avgReclaimed),
      efficiency:
        gcEvents > 0 && avgReclaimed > 5 * 1024 * 1024 ? "GOOD" : "POOR",
    };
  }

  // Force garbage collection if available (requires --expose-gc flag)
  forceGC() {
    if (global.gc) {
      global.gc();
      return true;
    }
    return false;
  }

  // Start monitoring
  startMonitoring(intervalMs = 2000, maxMeasurements = 30, forceGC = false) {
    console.log(`Starting memory monitoring for ${this.processName}...`);
    console.log(
      `Taking measurements every ${intervalMs}ms for ${maxMeasurements} iterations`,
    );
    if (forceGC) {
      console.log(
        `🗑️  Forcing GC before each measurement (requires --expose-gc)`,
      );
    }
    console.log("");

    let count = 0;
    const interval = setInterval(() => {
      // Force GC if requested and available
      if (forceGC && !this.forceGC()) {
        console.log(
          "⚠️  GC not available. Run with --expose-gc flag for more accurate results.",
        );
      }

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
            `   Heap Growth Rate: ${analysis.heapGrowthRate}/measurement`,
          );
          console.log(
            `   RSS Growth Rate: ${analysis.rssGrowthRate}/measurement`,
          );
          console.log(
            `   Consistent Growth: ${analysis.consistentGrowth ? "YES" : "NO"}`,
          );
        } else {
          console.log(`   Memory usage appears stable`);
        }
        console.log(
          `   Memory Pressure: ${analysis.memoryPressure.pressure} (${analysis.memoryPressure.heapUtilization}% heap used)`,
        );
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
    console.log("MEMORY ANALYSIS REPORT");
    console.log("=".repeat(50));

    if (this.measurements.length === 0) {
      console.log("No measurements collected");
      return;
    }

    const first = this.measurements[0];
    const last = this.measurements[this.measurements.length - 1];
    const analysis = this.analyzeMeasurements();

    console.log(`Total Measurements: ${this.measurements.length}`);
    console.log(
      ` Duration: ${((last.timestamp - first.timestamp) / 1000).toFixed(1)}s`,
    );
    console.log("");

    console.log("MEMORY CHANGES:");
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

    console.log("LEAK ANALYSIS:");
    console.log(
      `   Status: ${analysis.hasLeak ? "POTENTIAL LEAK DETECTED" : "NO LEAK DETECTED"}`,
    );
    console.log(
      `   Heap Trend: ${analysis.heapTrend} (${analysis.heapGrowthRate}/measurement)`,
    );
    console.log(
      `   RSS Trend: ${analysis.rssTrend} (${analysis.rssGrowthRate}/measurement)`,
    );
    console.log(
      `   Consistent Growth: ${analysis.consistentGrowth ? "YES" : "NO"}`,
    );
    console.log(
      `   Memory Pressure: ${analysis.memoryPressure.pressure} (${analysis.memoryPressure.heapUtilization}% heap utilization)`,
    );
    console.log(
      `   GC Efficiency: ${analysis.gcEfficiency.efficiency} (${analysis.gcEfficiency.events} events, avg ${analysis.gcEfficiency.avgReclaimed} reclaimed)`,
    );

    if (analysis.hasLeak) {
      console.log("");
      console.log("RECOMMENDATIONS:");
      console.log("   1. Check for event listeners that are not being removed");
      console.log(
        "   2. Look for closures holding references to large objects",
      );
      console.log("   3. Verify timers/intervals are being cleared");
      console.log("   4. Check for global variables accumulating data");
      console.log(
        "   5. Review React components for missing cleanup in useEffect",
      );
      console.log(
        "   6. Consider using WeakMap/WeakSet for temporary references",
      );
      console.log(
        "   7. Profile with --inspect flag to identify specific leak sources",
      );
    } else if (analysis.memoryPressure.pressure === "HIGH") {
      console.log("");
      console.log("HIGH MEMORY PRESSURE DETECTED:");
      console.log("   Consider optimizing memory usage even without leaks");
      console.log("   1. Review large object allocations");
      console.log(
        "   2. Implement object pooling for frequently created objects",
      );
      console.log("   3. Use streaming for large data processing");
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
    console.log(`\nDetailed report saved to: ${filename}`);
  }
}

// Start monitoring if this script is run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const interval = parseInt(args[0]) || 2000;
  const measurements = parseInt(args[1]) || 20;
  const forceGC = args.includes("--gc");

  console.log("Memory Leak Detector");
  console.log(
    "Usage: node memory-check.cjs [interval_ms] [measurements] [--gc]",
  );
  console.log("Example: node memory-check.cjs 1000 30 --gc\n");

  const monitor = new MemoryMonitor("Next.js Dev Server");
  monitor.startMonitoring(interval, measurements, forceGC);
}

module.exports = MemoryMonitor;
