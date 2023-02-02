import Preferences from './window-preferences/Preferences.svelte';

document.addEventListener('pointerlockerror', _ => document.exitPointerLock(), false);
window.onerror = (ev) => {
    console.error(ev)
}
export default new Preferences({
    target: document.body
});
