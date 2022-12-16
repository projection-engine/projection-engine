import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from "@rollup/plugin-image";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import {terser} from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import {string} from "rollup-plugin-string";
import typescript from "@rollup/plugin-typescript";
const PRODUCTION = !process.env.ROLLUP_WATCH;

const worker = (fileName, output) => ({
    input: fileName,
    output: {
        strict: false,
        sourcemap: false,
        file: output,
        format: 'iife'
    },
    plugins: [
        typescript(),
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
        input: "backend/index.js",
        output: {
            strict: false,
            sourcemap: false,
            file: "build/electron.js",
            format: 'cjs'
        },
        plugins: [
            typescript(),
            copy({
                targets: [
                    { src: 'engine-core/lib/ammo.wasm.wasm', dest: 'build' },
                    { src: 'backend/libs/assimp/assimpjs.wasm', dest: 'build' },
                    { src: 'public/index.html', dest: 'build' }
                ]
            }),
            resolve({
                dedupe: ["electron", "sharp"]
            }),
            commonjs({ignore: ["electron", "sharp"], sourceMap: false }),
            json(),
            PRODUCTION && terser()
        ]
    },
    worker("engine-core/workers/entity-worker.js", "build/entity-worker.js"),
    worker("engine-core/workers/camera-worker.js", "build/camera-worker.js"),
    worker("engine-core/workers/terrain-worker.js", "build/terrain-worker.js"),
    worker("engine-core/workers/image-worker.js", "build/image-worker.js"),

    {
        input: `frontend/index.js`,
        output: {
            strict: false,
            sourcemap: false,
            format: 'iife',
            file: `build/frontend.js`
        },
        plugins: [
            typescript(),
            svelte({
                compilerOptions: {
                    dev: !PRODUCTION,
                    css: css => {
                        css.write(`build/frontend.css`);
                    }
                }
            }),
            css({output: `frontend.css`}),
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
                include: ["**/*.glsl", "**/*.frag","**/*.vert", "**/*.base64"]
            })
        ],
        watch: {
            clearScreen: false
        }
    }
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