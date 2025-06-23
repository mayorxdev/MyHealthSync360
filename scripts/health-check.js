#!/usr/bin/env node

/**
 * Health Check Script for MyHealthSync360
 * This script verifies that the application is running correctly
 */

const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || `${PROTOCOL}://${HOST}:${PORT}`;

console.log("🏥 Running health check for MyHealthSync360...");
console.log(`📍 Checking: ${APP_URL}`);

const client = PROTOCOL === "https" ? https : http;

function healthCheck() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const req = client.get(APP_URL, (res) => {
      const responseTime = Date.now() - startTime;

      if (res.statusCode === 200) {
        console.log(`✅ Health check passed!`);
        console.log(`   - Status: ${res.statusCode}`);
        console.log(`   - Response time: ${responseTime}ms`);
        console.log(`   - Server: ${res.headers.server || "Unknown"}`);
        resolve({
          status: "healthy",
          statusCode: res.statusCode,
          responseTime,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log(
          `⚠️ Health check warning - Unexpected status code: ${res.statusCode}`
        );
        reject(new Error(`Health check failed with status ${res.statusCode}`));
      }
    });

    req.on("error", (error) => {
      console.log(`❌ Health check failed: ${error.message}`);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.log("❌ Health check timed out after 10 seconds");
      req.abort();
      reject(new Error("Health check timeout"));
    });
  });
}

// Check environment variables
function checkEnvironment() {
  console.log("🔍 Checking environment configuration...");

  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.log(`⚠️ Missing environment variables: ${missingVars.join(", ")}`);
    return false;
  }

  console.log("✅ Environment configuration looks good");
  return true;
}

// Main health check function
async function main() {
  try {
    // Check environment first
    const envOk = checkEnvironment();

    if (!envOk && process.env.NODE_ENV === "production") {
      console.log("❌ Environment check failed");
      process.exit(1);
    }

    // Run health check
    await healthCheck();

    console.log("🎉 All health checks passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Health check interrupted");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Health check terminated");
  process.exit(0);
});

// Run the health check
main();
