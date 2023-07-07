import Projects from "./projects/Projects.svelte"
import WindowInitializer from "./shared/WindowInitializer"

WindowInitializer.initialize()

new Projects({
	target: document.body
})

