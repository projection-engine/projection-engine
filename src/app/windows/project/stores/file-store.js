import {writable} from 'svelte/store';
import entityReducer from "../libs/engine-extension/entityReducer";

export const fileStore = writable({
    bookmarks: [],
    isLoading: true,
    items: [],
    images: [],
    meshes: [],
    materials: [],
    scripts: []
});