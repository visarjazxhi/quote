import { PrismaClient } from "@prisma/client";

// Type for database errors that may have a code property
interface DatabaseError extends Error {
  code?: string;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Test the database connection
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Enhanced database connection with detailed error reporting
export async function connectWithDiagnostics() {
  console.log("🔍 Checking database configuration...");

  // Check if DATABASE_URL is present
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    throw new Error("DATABASE_URL environment variable is missing");
  }

  console.log("✅ DATABASE_URL is present");

  try {
    console.log("🔄 Attempting database connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Test a simple query
    console.log("🔄 Testing database query...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database query test successful");

    return { success: true };
  } catch (error) {
    console.error("❌ Database connection or query failed:");
    console.error(error);

    // Provide specific error details
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        code: (error as DatabaseError).code,
        details: error.toString(),
      };
    }

    return {
      success: false,
      error: "Unknown database error",
      details: String(error),
    };
  }
}
