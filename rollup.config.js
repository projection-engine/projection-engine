import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import image from "@rollup/plugin-image";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import {uglify} from "rollup-plugin-uglify";

const PRODUCTION = !process.env.ROLLUP_WATCH;
const common = (inputFile, outputFile) => ({

    input: `src/${inputFile}.js`,
    output: {
        strict: false,
        sourcemap: false,
        format: 'iife',
        name: 'app',
        file: `public/build/${outputFile}.js`,
    },
    plugins: [
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
        commonjs(),
        !PRODUCTION && serve(),
        !PRODUCTION && livereload('public'),
        PRODUCTION && uglify(),
        image(),
        json()
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
        commonjs(),
        json(),
        uglify()
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
                dedupe: ["electron"]
            }),
            commonjs({ ignore: ["electron"]}),
            json(),
            uglify()
        ]
    },
    worker("public/engine/production/movement-worker.js", "public/build/movement-worker.js"),
    worker("public/engine/production/camera-worker.js", "public/build/camera-worker.js"),
    common("home/root", "home"),
    common("editor/root", "editor"),
    common("preferences/root", "preferences")
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