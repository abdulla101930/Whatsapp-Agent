/**
 * Validates required env vars and checks Supabase tables exist.
 * Loads .env.local from project root (no dotenv dependency).
 */
import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import { URL } from "url";

function httpsGetJson(urlStr, headers) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "GET",
        headers,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          resolve({ status: res.statusCode ?? 0, text });
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local — copy .env.example to .env.local and fill in values.");
  process.exit(1);
}

const raw = fs.readFileSync(envPath, "utf8");
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
  let val = trimmed.slice(eq + 1).trim();
  if (!val.startsWith('"') && !val.startsWith("'")) {
    val = val.replace(/\s+#.*$/, "").trim();
  }
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  if (process.env[key] === undefined) process.env[key] = val;
}

const required = [
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_VERIFY_TOKEN",
  "GROQ_API_KEY",
  "AI_MODEL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

let failed = false;
for (const key of required) {
  const v = process.env[key];
  if (v == null || String(v).trim() === "") {
    console.error(`Missing or empty: ${key}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nFill these in .env.local (see .env.example).");
  process.exit(1);
}

const base = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const sr = process.env.SUPABASE_SERVICE_ROLE_KEY;

try {
  const { status, text } = await httpsGetJson(`${base}/rest/v1/conversations?select=id&limit=1`, {
    apikey: sr,
    Authorization: `Bearer ${sr}`,
  });
  if (status < 200 || status >= 300) {
    console.error("Supabase REST error (tables may be missing). Run supabase-schema.sql in Supabase SQL Editor.");
    console.error(`HTTP ${status}: ${text.slice(0, 200)}`);
    process.exit(1);
  }
} catch (e) {
  console.error("Could not reach Supabase:", e.message);
  process.exit(1);
}

console.log("Environment OK. Supabase tables reachable.");
process.exit(0);
