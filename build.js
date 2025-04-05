// build.js
import { build } from "esbuild";

function outfile(infix = null) {
    if (infix) return `dist/yonc.${infix}.mjs`
    else return "dist/yonc.mjs";
}

const commonConfig = {
    entryPoints: ["index.mjs"],
    bundle: true,
    format: "esm",
    sourcemap: false,
    target: ["es2020"],
};

await build({
    ...commonConfig,
    outfile: outfile(),
    minify: false
});

await build({
    ...commonConfig,
    outfile: outfile("min"),
    minify: true
});

await build({
    ...commonConfig,
    outfile: outfile("nomorph"),
    external: ["morphdom"],
    minify: false
});
