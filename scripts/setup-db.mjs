// Applies supabase/migrations/*.sql and (if tables are empty) supabase/seed.sql
// to the database in SUPABASE_DB_URL. Used by deploy.bat; safe to re-run.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import pg from "pg";

const root = resolve(import.meta.dirname, "..");

// --- load .env.local (no dotenv dependency) ---
const envFile = join(root, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL missing in .env.local (Supabase → Project Settings → Database → Connection string → URI)");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  const migDir = join(root, "supabase", "migrations");
  const files = readdirSync(migDir).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    process.stdout.write(`  migration ${f} ... `);
    await client.query(readFileSync(join(migDir, f), "utf8"));
    console.log("ok");
  }

  const { rows } = await client.query("select count(*)::int as n from public.updates");
  if (rows[0].n > 0) {
    console.log(`  seed skipped (updates already has ${rows[0].n} rows)`);
  } else {
    process.stdout.write("  seed.sql ... ");
    await client.query(readFileSync(join(root, "supabase", "seed.sql"), "utf8"));
    console.log("ok");
  }
  console.log("Database ready.");
} finally {
  await client.end();
}
