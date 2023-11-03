import chokidar from "chokidar";
import { execa } from "execa";
import esbuild from "esbuild";
import { esbuildConf } from "./bundle.mjs";

const ctx = await esbuild.context(esbuildConf);

const srcWatcher = chokidar.watch("src")

srcWatcher
  .on('ready', () =>
    srcWatcher
      .on("all", async (event, path) => {
        console.log(event, path);
        console.log(await ctx.rebuild())
      }))


const startTW = () => {
  console.log("Starting Tiddlywiki");
  return execa("tiddlywiki", ["editions/demo", "--listen", "--verbose"], {
    preferLocal: true,
    env: {
      TIDDLYWIKI_PLUGIN_PATH: "./plugins",
    },
  })
    .pipeStdout(process.stdout)
    .pipeStderr(process.stderr);
};

const twWatcher = chokidar.watch("plugins");

let tw;

twWatcher.on("ready", () => {
  tw = startTW();
  twWatcher.on("all", async (event, path) => {
    console.log(event, path);

    tw.kill("SIGTERM", {
      forceKillAfterTimeout: 2000,
    });

    tw = startTW();
  });
});
