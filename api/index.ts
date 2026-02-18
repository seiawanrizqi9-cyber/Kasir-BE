const express = require("express");
const app = require("../src/app").default;

// Assuming ts-node or similar handles tsconfig paths in dev,
// for Vercel production we might rely on built JS or just correct path resolution.
// Since we are deploying TS directly to Vercel (using @vercel/node), we might not need
// complex path registration if Vercel handles tsconfig.json properly.
// However, to be safe against runtime alias issues, we can try to register.

// But wait, @vercel/node usually respects tsconfig.json.
// If specific aliases fail, it's often better to just export the app directly
// and let Vercel's build process handle it, OR ensure tsconfig-paths is registered.

// Let's go with a simple export first as modern Vercel runtimes are good with TS.
// If aliases are an issue, we can revisit.
// Actually, I should stick to the plan: register aliases to be safe.

const path = require("path");
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = path.resolve(__dirname, "../src");

tsConfigPaths.register({
  baseUrl,
  paths: {
    "@/*": ["*"],
    "@controllers/*": ["controllers/*"],
    "@services/*": ["services/*"],
    "@repositories/*": ["repositories/*"],
    "@middlewares/*": ["middlewares/*"],
    "@utils/*": ["utils/*"],
    "@config/*": ["config/*"],
    "@types/*": ["types/*"],
    "@validators/*": ["validators/*"],
  },
});

module.exports = app;
