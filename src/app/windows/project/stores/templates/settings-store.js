import {writable} from 'svelte/store';
import SETTINGS from "../../data/misc/SETTINGS";

export const settingsStore = writable(SETTINGS);