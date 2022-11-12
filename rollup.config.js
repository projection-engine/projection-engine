import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from "@rollup/plugin-image";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import {terser} from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import {string} from "rollup-plugin-string";

const PRODUCTION = !process.env.ROLLUP_WATCH;
const common = (inputFile, outputFile) => ({
    input: `src/${inputFile}.js`,
    output: {
        strict: false,
        sourcemap: false,
        format: 'iife',
        file: `public/build/${outputFile}.js`
    },
    plugins: [
        copy({
            targets: [
                { src: 'public/engine/lib/ammo.wasm.wasm', dest: 'public/build' },
                { src: 'public/backend/lib/assimp/assimpjs.wasm', dest: 'public/build' }
            ]
        }),
        svelte({
            compilerOptions: {
                dev: !PRODUCTION,
                css: css => {
                    css.write(`public/build/${outputFile}.css`);
                }
            }
        }),
        css({output: `${outputFile}.css`}),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs({sourceMap: false }),
        !PRODUCTION && serve(),
        PRODUCTION && terser(),
        image(),
        json(),
        string({
            include: ["**/*.glsl", "**/*.frag","**/*.vert"]
        })
    ],
    watch: {
        clearScreen: false
    }
})
const worker = (fileName, output) => ({
    input: fileName,
    output: {
        strict: false,
        sourcemap: false,
        file: output,
        format: 'iife'
    },
    plugins: [
        resolve({
            browser: true
        }),
        commonjs({sourceMap: false}),
        json(),
        PRODUCTION && terser()
    ]
})
export default [
    {
        input: "public/backend/index.js",
        output: {
            strict: false,
            sourcemap: false,
            file: "public/build/electron.js",
            format: 'cjs'
        },
        plugins: [
            resolve({
                dedupe: ["electron", "sharp"]
            }),
            commonjs({ignore: ["electron", "sharp"], sourceMap: false }),
            json(),
            PRODUCTION && terser()
        ]
    },
    worker("public/engine/workers/movement/movement-worker.js", "public/build/movement-worker.js"),
    worker("public/engine/workers/camera/camera-worker.js", "public/build/camera-worker.js"),
    worker("public/engine/workers/terrain/terrain-worker.js", "public/build/terrain-worker.js"),
    worker("public/engine/workers/image/image-worker.js", "public/build/image-worker.js"),
    common("root", "editor")
]

function serve() {
    let started = false;
    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'svelte-start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}