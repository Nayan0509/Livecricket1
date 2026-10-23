// Post-build step: rename build/index.html to build/app.html.
// On Vercel a file at build/index.html would be served for "/" before the
// rewrite to api/index.js runs, so the homepage would skip api/render.js and
// get a different (empty) shell from every other page.
const fs = require("fs");
const path = require("path");

const build = path.join(__dirname, "..", "build");
fs.renameSync(path.join(build, "index.html"), path.join(build, "app.html"));
console.log("Moved build/index.html to build/app.html");
