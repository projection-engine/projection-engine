export default {
    meta: {},
    meshes: new Map(),
    materials: [],
    viewportInitialized: false,
    entities: new Map(),
    cameraInitialized: false,
    executingAnimation: false,
    selected: [],
    scripts: [],
    changeID: undefined,
    selectedEntity: undefined,
    lockedEntity: undefined,

    currentLevel: undefined
}