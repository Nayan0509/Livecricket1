// Download and unzip Cricsheet archives using Node built-ins plus a system unzip tool.
//
// Node's zlib reads gzip/deflate streams but not .zip archives, so extraction shells out
// (child_process.execFileSync, no shell) to the first tool that works:
//   Windows : %SystemRoot%\System32\tar.exe (bsdtar, ships with Windows 10+), then
//             PowerShell Expand-Archive.
//   Others  : unzip, then bsdtar, then tar (tar only works when it is bsdtar, e.g. macOS).
// Git Bash puts GNU tar first on PATH, and GNU tar cannot read zip, which is why the
// Windows path to bsdtar is used explicitly.
"use strict";

const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const { execFileSync } = require("child_process");

async function download(url, dest, { log = console.log } = {}) {
  const res = await fetch(url, { headers: { "User-Agent": "livecricketzone-cricsheet-build/1.0" } });
  if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status}`);
  const expected = Number(res.headers.get("content-length")) || null;
  const tmp = dest + ".part";
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(tmp));
  const size = fs.statSync(tmp).size;
  if (expected && size !== expected) {
    fs.rmSync(tmp, { force: true });
    throw new Error(`GET ${url}: got ${size} bytes, expected ${expected}`);
  }
  fs.renameSync(tmp, dest);
  log(`  downloaded ${url} (${(size / 1048576).toFixed(1)} MB, Last-Modified ${res.headers.get("last-modified") || "n/a"})`);
  return { url, bytes: size, lastModified: res.headers.get("last-modified") || null };
}

function tryRun(cmd, args) {
  try {
    execFileSync(cmd, args, { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
    return null;
  } catch (e) {
    return `${cmd}: ${(e.stderr && e.stderr.toString().trim()) || e.message}`.slice(0, 300);
  }
}

function extractZip(zipFile, outDir) {
  // Always start from a new, empty directory so stale files from an older archive never leak in.
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const attempts = [];
  if (process.platform === "win32") {
    const sysTar = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe");
    if (fs.existsSync(sysTar)) attempts.push([sysTar, ["-xf", zipFile, "-C", outDir]]);
    const q = (s) => "'" + s.replace(/'/g, "''") + "'";
    attempts.push(["powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
      `Expand-Archive -LiteralPath ${q(zipFile)} -DestinationPath ${q(outDir)} -Force`]]);
  } else {
    attempts.push(["unzip", ["-q", "-o", zipFile, "-d", outDir]]);
    attempts.push(["bsdtar", ["-xf", zipFile, "-C", outDir]]);
    attempts.push(["tar", ["-xf", zipFile, "-C", outDir]]);
  }

  const errors = [];
  for (const [cmd, args] of attempts) {
    const err = tryRun(cmd, args);
    const count = fs.readdirSync(outDir).filter((f) => f.endsWith(".json")).length;
    if (!err && count > 0) return { tool: path.basename(cmd), jsonFiles: count };
    errors.push(err || `${cmd}: produced no .json files`);
  }
  throw new Error(`Could not extract ${zipFile}. Tried:\n  ${errors.join("\n  ")}`);
}

module.exports = { download, extractZip };
