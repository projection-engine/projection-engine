import Editor from "./Editor.svelte"
import WindowInitializer from "../shared/WindowInitializer"

WindowInitializer.initialize()

new Editor({
	target: document.body
})
