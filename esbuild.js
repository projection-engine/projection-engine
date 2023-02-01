const esbuild = require('esbuild')
const sveltePreprocess = require('svelte-preprocess')
const sveltePlugin = require('esbuild-svelte')
const {copy} = require('esbuild-plugin-copy')

const LOADERS = {".glsl": "text", ".frag": "text", ".vert": "text", ".svg": "text"}
const production = process.argv[2] === 'prod'
let watch = false
if (process.argv[2] === 'watch')
    watch = {
        onRebuild(error) {
            if (error) console.error((new Date()).toDateString() + ' FAILED: ', error)
            else console.log((new Date()).toLocaleTimeString() + ' SUCCEEDED')
        }
    }

function worker(fileName, output) {
    return {
        tsconfig: "tsconfig.json",
        treeShaking: true,
        platform: "browser",
        entryPoints: [fileName],
        ignoreAnnotations: true,
        bundle: true,
        watch,
        format: 'iife',
        target: ['es2022'],
        minify: production,
        sourcemap: false,
        outfile: output,
        plugins: [],
        loader: LOADERS
    }
}

function frontend(fileName, outputName) {
    return {
        tsconfig: "tsconfig.json",
        treeShaking: true,
        platform: "browser",
        entryPoints: ['./frontend/views/' + fileName],
        bundle: true,
        watch,
        format: 'iife',
        target: ['es2022'],
        minify: production,
        sourcemap: false,
        outfile: './build/' + outputName + ".js",
        ignoreAnnotations: true,
        plugins: [
            sveltePlugin({
                preprocess: sveltePreprocess({typescript: {tsconfigFile: "tsconfig.json"}}),
                filterWarnings: () => false
            })
        ],
        loader: LOADERS
    }
}

const electron = {
    ignoreAnnotations: true,
    tsconfig: "tsconfig.json",
    treeShaking: true,
    platform: "node",
    entryPoints: ['./backend/index.ts'],
    bundle: true,
    target: ['es2022'],
    watch,
    format: 'cjs',
    minify: production,
    external: ["electron", "sharp"],
    sourcemap: false,
    outfile: './build/index.js',
    plugins: [
        copy({
            assets: [
                {
                    from: [
                        './engine-core/assets-to-copy/*'
                    ],
                    to: ['./']
                },
                {
                    from: [
                        './assets-to-copy/*'
                    ],
                    to: ['./']
                }
            ]
        })
    ],
    loader: LOADERS
}

const workers = [
    worker("engine-core/workers/entity-worker.ts", "build/entity-worker.js"),
    worker("engine-core/workers/camera-worker.ts", "build/camera-worker.js"),
    worker("engine-core/workers/terrain-worker.ts", "build/terrain-worker.js"),
    worker("engine-core/workers/image-worker.ts", "build/image-worker.js"),
]
esbuild.build(frontend("editor/editor-window.ts", "editor-window"))
    .then(() => console.log("SUCCESS - EDITOR"))
    .catch((err) => console.error(err))

workers.forEach((worker, i) => {
    esbuild.build(worker)
        .then(() => console.log("SUCCESS - WORKER - " + i))
        .catch((err) => console.error(err))
})
esbuild.build(electron)
    .then(() => console.log("SUCCESS - BACKEND"))
    .catch((err) => console.error(err))

esbuild.build(frontend("projects/project-window.ts", "project-window"))
    .then(() => console.log("SUCCESS - PROJECTS"))
    .catch((err) => console.error(err))

