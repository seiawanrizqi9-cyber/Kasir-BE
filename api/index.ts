import path from "path";
import { fileURLToPath } from "url";
import { register } from "tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register path aliases for runtime resolution
// api/index.ts is in /api, so src is ../src
const baseUrl = path.resolve(__dirname, "../src");

register({
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

export default async (req: any, res: any) => {
  // Ensure aliases are registered
  register({
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

  // Dynamic import to ensure aliases apply
  const app = (await import("../src/app")).default;
  return app(req, res);
};
