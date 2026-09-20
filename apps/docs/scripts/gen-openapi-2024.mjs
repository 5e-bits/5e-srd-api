// Usage: pnpm --filter api bundle-swagger && pnpm gen-openapi
import { readFileSync, writeFileSync } from "node:fs";

const spec = JSON.parse(readFileSync("../api/dist/openapi.json", "utf8"));

spec.paths = Object.fromEntries(
  Object.entries(spec.paths).filter(
    // Monsters are left out until the SRD 5.2 monsters are loaded
    ([path]) => path.startsWith("/api/2024") && !path.startsWith("/api/2024/monsters")
  )
);

// The intro is covered by the guide pages, and its raw HTML breaks MDX
spec.info.description = "";

// Some 2024 paths reuse 2014 parameters, and the plugin never generates the anchor they link to
const out = JSON.stringify(spec, null, 2)
  .replace(/^\s*"monsters"(: "\/api\/2024\/monsters")?,\n/gm, "")
  .replaceAll(
    /#get-\/api\/20\d\d\/-endpoint-/g,
    "/api/2024/get-list-of-all-available-resources-for-an-endpoint"
  );

writeFileSync("openapi-2024.json", out + "\n");
