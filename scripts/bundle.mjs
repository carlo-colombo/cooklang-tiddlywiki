import esbuild from "esbuild";

export const esbuildConf = {
  entryPoints: ["src/cooklang.js"],
  bundle: true,
  format: "cjs",
  outfile: "plugins/litapp/cooklang/tiddlers/js/lib/cooklang.js",
  banner: {
    js: `// file generated from source files in 'src' directory`,
  },
};

console.log(await esbuild.build(esbuildConf));
