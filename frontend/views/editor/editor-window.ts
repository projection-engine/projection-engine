import Editor from './Editor.svelte';

document.addEventListener('pointerlockerror', _ => document.exitPointerLock(), false);
window.onerror = (ev) => {
    console.error(ev)
}
export default new Editor({
    target: document.body
});
