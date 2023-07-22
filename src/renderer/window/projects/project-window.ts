import Projects from "./Projects.svelte"
import WindowInitializer from "../shared/WindowInitializer"

WindowInitializer.initialize()

new Projects({
	target: document.body
})

