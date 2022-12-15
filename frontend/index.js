import Main from './Index.svelte';
import ConsoleAPI from "../engine-core/lib/utils/ConsoleAPI";

window.consoleAPI = ConsoleAPI
alert.pushAlert = () => null
export default new Main({
	target: document.body
});

