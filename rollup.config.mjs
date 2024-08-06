import copy from "rollup-plugin-copy-watch";
import serve from "rollup-plugin-serve";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const isWatchMode =
  process.argv.includes("-w") || process.argv.includes("--watch");

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    copy({
      watch: isWatchMode ? "src/" : false,

      targets: [
        { src: "src/index.html", dest: "dist" },
        { src: "src/styles.css", dest: "dist" },
      ],
    }),
    isWatchMode && serve("dist"),
    json({
      compact: true,
    }),
    resolve(),
    commonjs(),
  ],
  watch: {
    exclude: "node_modules/**",
  },
};
