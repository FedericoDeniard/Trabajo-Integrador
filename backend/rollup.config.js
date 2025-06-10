import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeExternals } from "rollup-plugin-node-externals";
import copy from "rollup-plugin-copy";
import path from "path";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    copy({
      targets: [
        {
          src: path.join("..", "frontend", "**", "*"),
          dest: path.join("dist", "frontend"),
        },
      ],
      verbose: true,
      hook: "buildStart",
    }),
    nodeExternals(),
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    commonjs(),
    json(),
  ],
};
