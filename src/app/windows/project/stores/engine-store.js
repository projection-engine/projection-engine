import {writable} from 'svelte/store';
import entityReducer from "../libs/engine-extension/entityReducer";
import ENGINE from "../static/misc/ENGINE";

export const engine = writable(ENGINE);