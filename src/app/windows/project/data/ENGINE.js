import VIEWPORT_TABS from "./VIEWPORT_TABS";

export default {
    meta: {},
    viewportInitialized: false,
    entities: new Map(),
    cameraInitialized: false,
    executingAnimation: false,
    scripts: [],
    changeID: undefined,

    currentLevel: undefined,
    viewportTab: VIEWPORT_TABS.EDITOR
}