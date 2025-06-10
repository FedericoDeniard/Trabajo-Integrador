import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeExternals } from "rollup-plugin-node-externals";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    del({ targets: "dist/*" }),

    copy({
      targets: [
        {
          src: "../frontend/**/*",
          dest: "dist/frontend",
        },
      ],
      hook: "writeBundle",
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
