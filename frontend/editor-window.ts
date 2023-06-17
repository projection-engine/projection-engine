import Editor from "./window-editor/Editor.svelte"

document.addEventListener("pointerlockerror", _ => document.exitPointerLock(), false)
window.onerror = (err, source, lineno) => {
	console.log("ERROR CAUGHT: ", err, lineno, source)
	return false;
}
export default new Editor({
	target: document.body
})
