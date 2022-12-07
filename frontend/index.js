import Main from './Index.svelte';
import ConsoleAPI from "../public/engine/lib/utils/ConsoleAPI";

window.consoleAPI = ConsoleAPI
alert.pushAlert = () => null
export default new Main({
	target: document.body
});

