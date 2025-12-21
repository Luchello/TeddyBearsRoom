/**
 * Manual Migration Runner
 * Run: npx tsx prisma/migrations/manual/run-migration.ts
 *
 * Uses pg package directly (not PrismaClient) for raw SQL execution
 */

import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_URL not found in environment");
  }

  console.log("Connecting to database...");
  const pool = new Pool({ connectionString });

  try {
    console.log("Starting migration...\n");

    const sqlPath = path.join(__dirname, "add_referral_milestone_system.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    // Split by semicolons but handle $$ blocks
    const statements = splitSqlStatements(sql);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt || stmt.startsWith("--")) continue;

      try {
        const preview = stmt.substring(0, 60).replace(/\n/g, " ");
        console.log(`[${i + 1}/${statements.length}] ${preview}...`);
        await pool.query(stmt);
        console.log(`  ✓ Done`);
      } catch (error: unknown) {
        // Ignore "already exists" errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate key") ||
          errorMessage.includes("42710") // PostgreSQL error code for duplicate
        ) {
          console.log(`  ⊘ Skipped (already exists)`);
        } else {
          console.error(`  ✗ Error:`, errorMessage);
          // Continue with other statements
        }
      }
    }

    console.log("\n========================================");
    console.log("Migration completed!");
    console.log("========================================");
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inDollarQuote = false;

  const lines = sql.split("\n");
  for (const line of lines) {
    // Check for $$ start/end
    const dollarCount = (line.match(/\$\$/g) || []).length;
    if (dollarCount % 2 === 1) {
      inDollarQuote = !inDollarQuote;
    }

    current += line + "\n";

    // If not in $$ block and line ends with ;
    if (!inDollarQuote && line.trim().endsWith(";")) {
      statements.push(current.trim());
      current = "";
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements;
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  });
