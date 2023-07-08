const esbuild = require("esbuild")
const sveltePreprocess = require("svelte-preprocess")
const sveltePlugin = require("esbuild-svelte")
const {copy} = require("esbuild-plugin-copy")

const production = process.argv[2] === "prod"
let watch = false
if (process.argv[2] === "watch")
	watch = {
		onRebuild(error) {
			if (error) console.error((new Date()).toDateString() + " FAILED: ", error)
			else console.log((new Date()).toLocaleTimeString() + " SUCCEEDED")
		}
	}

const COMMON = {
	tsconfig: "tsconfig.json",
	bundle: true,
	watch,
	target: ["es2022"],
	minify: production,
	sourcemap: !production,
	ignoreAnnotations: true,
	loader: {".glsl": "text", ".frag": "text", ".vert": "text", ".svg": "text"}
}


function worker(fileName, output) {
	return {
		...COMMON,
		platform: "browser",
		entryPoints: [fileName],
		format: "iife",
		outfile: output,
		plugins: []
	}
}

function frontend(fileName, outputName) {
	return {
		...COMMON,
		platform: "browser",
		entryPoints: ["./frontend/" + fileName],
		format: "iife",
		outfile: "./build/" + outputName + ".js",
		plugins: [
			sveltePlugin({
				preprocess: sveltePreprocess({typescript: {tsconfigFile: "tsconfig.json"}}),
				filterWarnings: () => false
			})
		],

	}
}

const electron = {
	...COMMON,
	platform: "node",
	entryPoints: ["./electron/index.ts"],
	format: "cjs",
	external: ["electron", "sharp"],
	outfile: "./build/index.js",
	plugins: [
		copy({
			assets: [
				{
					from: [
						"./static/*"
					],
					to: ["./"]
				}
			]
		})
	]
}

const workers = [
	worker("engine-core/core/workers/entity-worker.ts", "build/entity-worker.js"),
	worker("engine-core/core/workers/camera-worker.ts", "build/camera-worker.js"),
	worker("engine-core/core/workers/terrain-worker.ts", "build/terrain-worker.js"),
	worker("engine-core/core/workers/image-worker.ts", "build/image-worker.js"),
]

workers.forEach((worker, i) => {
	esbuild.build(worker)
		.then(() => console.log("SUCCESS - WORKER - " + i))
		.catch((err) => console.error(err))
})
esbuild.build(frontend("editor-window.ts", "editor-window"))
	.then(() => console.log("SUCCESS - EDITOR"))
	.catch((err) => console.error(err))

esbuild.build(frontend("project-window.ts", "project-window"))
	.then(() => console.log("SUCCESS - PROJECTS"))
	.catch((err) => console.error(err))

esbuild.build(frontend("preferences-window.ts", "preferences-window"))
	.then(() => console.log("SUCCESS - PREFERENCES"))
	.catch((err) => console.error(err))


esbuild.build(electron)
	.then(() => console.log("SUCCESS - BACKEND"))
	.catch((err) => console.error(err))



