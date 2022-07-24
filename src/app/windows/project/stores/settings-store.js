import {writable} from 'svelte/store';
import SETTINGS from "../static/misc/SETTINGS";

export const settingsStore = writable(SETTINGS);