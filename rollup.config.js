import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import {terser} from 'rollup-plugin-terser';
import image from "@rollup/plugin-image";
import css from "rollup-plugin-css-only";


const common = (inputFile, outputFile, cssFile) => ({
    input: `src/app/windows/${inputFile}.js`,
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: `public/build/${outputFile}.js`
    },
    plugins: [
        svelte({

            compilerOptions: {
                dev: !production,
                css: css => {
                    css.write(`public/build/${cssFile}.css`);
                }
            }
        }),
        css({ output: `${cssFile}.css` }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        !production && serve(),
        !production && livereload('public'),
        production && terser(),
        image()
    ],
    watch: {
        clearScreen: false
    }
})
const production = false;
export default [
    common("home/root", "home", "home"),
    common("project/root", "project", "project"),
    common("settings/root", "settings", "settings")
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