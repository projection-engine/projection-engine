import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from "@rollup/plugin-image";
import css from "rollup-plugin-css-only";
import {terser} from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import {string} from "rollup-plugin-string";
import typescript from 'rollup-plugin-typescript2';
import autoPreprocess from 'svelte-preprocess';


const PRODUCTION = false //!process.env.ROLLUP_WATCH;

const TS = typescript({
    sourceMap: false,
    tsconfigDefaults: { compilerOptions: { declaration: true } },
    tsconfig: "tsconfig.json",
    tsconfigOverride: { compilerOptions: { declaration: false } },
    // clean: false,
    check: false
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
        resolve({browser: true}),
        commonjs({sourceMap: false}),
        TS,
        PRODUCTION && terser()
    ]
})

export default [
    {
        input: "backend/index.ts",
        output: {
            strict: false,
            sourcemap: false,
            file: "build/electron.js",
            format: 'cjs'
        },
        plugins: [

            copy({
                targets: [
                    { src: 'static/APP_LOGO.png', dest: 'build' },
                    { src: 'engine-tools/static/STATIC_GIZMO_DATA.json', dest: 'build' },
                    { src: 'engine-core/static/STATIC_MESHES.json', dest: 'build' },
                    { src: 'engine-core/lib/ammo.wasm.wasm', dest: 'build' },
                    { src: 'backend/libs/assimp/assimpjs.wasm', dest: 'build' },
                    { src: 'static/index.html', dest: 'build' }
                ]
            }),
            resolve({
                dedupe: ["electron", "sharp"]
            }),
            commonjs({ignore: ["electron", "sharp"], sourceMap: false }),
            TS,
            PRODUCTION && terser()
        ]
    },
    worker("engine-core/workers/entity-worker.ts", "build/entity-worker.js"),
    worker("engine-core/workers/camera-worker.ts", "build/camera-worker.js"),
    worker("engine-core/workers/terrain-worker.ts", "build/terrain-worker.js"),
    worker("engine-core/workers/image-worker.ts", "build/image-worker.js"),

    {
        input: `frontend/index.ts`,
        output: {
            strict: false,
            sourcemap: false,
            format: 'iife',
            file: `build/frontend.js`
        },
        plugins: [

            svelte({
                preprocess: autoPreprocess(),
                compilerOptions: {
                    dev: !PRODUCTION,
                    css: css => css.write(`build/frontend.css`)
                }
            }),
            css({output: `frontend.css`}),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),

            commonjs({sourceMap: false }),
            TS,

            PRODUCTION && terser(),
            image(),
            string({
                include: ["**/*.glsl", "**/*.frag","**/*.vert", "**/*.base64"]
            })
        ],
        watch: {
            clearScreen: false
        }
    }
]
