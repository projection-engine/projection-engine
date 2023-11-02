const esbuild = require("esbuild")
const sveltePreprocess = require("svelte-preprocess")
const sveltePlugin = require("esbuild-svelte")
const {copy} = require("esbuild-plugin-copy")

const production = process.argv[2] === "prod"
const COMMON = {
    tsconfig: "tsconfig.json",
    bundle: true,
    target: ["es2022"],
    minify: production,
    sourcemap: production ? false : "linked",
    ignoreAnnotations: true,
    loader: {".glsl": "text", ".frag": "text", ".vert": "text", ".svg": "text"}
}

const worker = (fileName, output) => ({
    ...COMMON,
    platform: "browser",
    entryPoints: [fileName],
    format: "iife",
    outfile: output,
    plugins: []
})

const frontend = (fileName, outputName) => ({
    ...COMMON,
    platform: "browser",
    entryPoints: ["./src/renderer/window" + fileName],
    format: "iife",
    outfile: "./build/" + outputName + ".js",
    plugins: [
        sveltePlugin({
            preprocess: sveltePreprocess({typescript: {tsconfigFile: "tsconfig.json"}}),
            filterWarnings: () => false
        })
    ],
})
const entries = {
    "src/renderer/engine/core/workers/entity-worker.ts": "build/entity-worker.js",
    "src/renderer/engine/core/workers/camera-worker.ts": "build/camera-worker.js",
    "src/renderer/engine/core/workers/terrain-worker.ts": "build/terrain-worker.js",
    "src/renderer/engine/core/workers/image-worker.ts": "build/image-worker.js",
    "/editor/editor-window.ts": "editor-window",
    "/projects/project-window.ts": "project-window",
    "/preferences/preferences-window.ts": "preferences-window"
}
const entriesRegistered = []
start().catch(console.error)

async function start() {
    const contexts = []
    Object.entries(entries).forEach(entry => {
        let ctx
        if (entry[0].includes("-worker.ts"))
            ctx = esbuild.context(worker(...entry))
        else
            ctx = esbuild.context(frontend(...entry))
        contexts.push(ctx)
        entriesRegistered.push(entry[1])
    })
    contexts.push(esbuild.context({
        ...COMMON,
        platform: "node",
        entryPoints: ["./src/main/index.ts"],
        format: "cjs",
        external: ["electron", "sharp"],
        outfile: "./build/index.js",

        plugins: [copy({assets: [{from: ["./src/static/*"], to: ["./"]}]})]
    }))
    entriesRegistered.push("build/index.js")

    const resolvedContexts = await Promise.all(contexts)
    if (process.argv[2] === "watch")
        resolvedContexts.forEach((context, i) => {
            console.log("WATCHING => " + entriesRegistered[i])
            context.watch()
        })
    else
        resolvedContexts.forEach(context => context.dispose())

}
