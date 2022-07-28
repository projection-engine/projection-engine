import {writable} from 'svelte/store';

export const fileStore = writable({
    bookmarks: [],
    isLoading: true,
    items: [],
    images: [],
    meshes: [],
    materials: [],
    scripts: []
});