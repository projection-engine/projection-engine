import {writable} from 'svelte/store';

export const contentBrowserStore = writable({
    bookmarks: [],
    isLoading: true,
    items: [],
    textures: [],
    meshes: [],
    levels: [],
    stylesheets: [],
    materials: [],
    materialInstances: [],
    components: [],
    uiLayouts: []
});