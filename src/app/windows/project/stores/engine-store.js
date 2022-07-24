import {writable} from 'svelte/store';

export const engine = writable({
    meta: {},
    meshes: new Map(),
    materials: [],
    viewportInitialized: false,
    fallbackMaterial: undefined,
    entities: new Map(),
    cameraInitialized: false,
    executingAnimation: false,
    selected: [],
    levelScript: undefined,
    changeID: undefined
});