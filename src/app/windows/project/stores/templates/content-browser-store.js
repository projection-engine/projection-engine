import {writable} from 'svelte/store';

export const contentBrowserStore = writable({
    bookmarks: [],
    isLoading: true,
    items: [],
    images: [],
    meshes: [],
    materials: [],
    components: []
});