import Preferences from "./preferences/Preferences.svelte"
import WindowInitializer from "./shared/WindowInitializer"

WindowInitializer.initialize()

new Preferences({
	target: document.body
})
