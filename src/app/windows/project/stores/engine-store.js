import {writable} from 'svelte/store';
import entityReducer from "../libs/engine-extension/entityReducer";

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
    changeID: undefined,
    selectedEntity: undefined,
    lockedEntity: undefined,
    dispatchEntities (packageData, state) {
        entityReducer(packageData, this.entities, state)
    }
});