export async function register() {
  // This file is required by Next.js when using certain features
  // You can add instrumentation logic here if needed
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side instrumentation
    console.log("Server instrumentation registered");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime instrumentation
    console.log("Edge instrumentation registered");
  }
}
