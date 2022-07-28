import entityReducer from "../../libs/engine-extension/entityReducer";

export default {
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
}