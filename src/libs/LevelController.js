import FilesAPI from "./FilesAPI"
import ActionHistoryAPI from "./ActionHistoryAPI";
import Engine from "../../public/engine/Engine";
import RegistryAPI from "./RegistryAPI";

import ROUTES from "../data/ROUTES";
import CHANNELS from "../data/CHANNELS";
import GPU from "../../public/engine/GPU";
import COMPONENTS from "../../public/engine/static/COMPONENTS.js";
import componentConstructor from "../utils/component-constructor";
import STATIC_TEXTURES from "../../public/engine/static/resources/STATIC_TEXTURES";

import loadMaterial from "./loader/utils/load-material";
import TerrainWorker from "../../public/engine/workers/terrain/TerrainWorker";
import EngineStore from "../stores/EngineStore";
import SelectionStore from "../stores/SelectionStore";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import SettingsStore from "../stores/SettingsStore";
import VisualsStore from "../stores/VisualsStore";
import SETTINGS from "../data/SETTINGS";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import Localization from "../templates/LOCALIZATION_EN";
import CameraAPI from "../../public/engine/api/CameraAPI";
import TabsStore from "../stores/TabsStore";
import CameraTracker from "../../public/engine/editor-environment/libs/CameraTracker";
import GPUAPI from "../../public/engine/api/GPUAPI";
import serializeStructure from "../../public/engine/utils/serialize-structure";
import EntityAPI from "../../public/engine/api/EntityAPI";

const {ipcRenderer} = window.require("electron")


export default class LevelController {
    static #loadedLevel = undefined
    static #initialized = false

    static initialize(cb) {
        if (LevelController.#initialized)
            return
        LevelController.#initialized = true

        ipcRenderer.once(
            ROUTES.LOAD_PROJECT_METADATA,
            (ev, meta) => {

                if (meta.settings != null) {
                    console.log(meta)
                    const newSettings = {...SETTINGS, ...meta.settings}
                    if (newSettings.views[0].top == null)
                        newSettings.views = SETTINGS
                    newSettings.visualSettings = undefined
                    if (meta.layout)
                        TabsStore.updateStore(meta.layout)
                    SettingsStore.updateStore(newSettings)
                    if (meta.visualSettings)
                        VisualsStore.updateStore({...meta.visualSettings})
                }
                EngineStore.updateStore({
                    ...EngineStore.engine,
                    meta: {...meta, settings: undefined, visualSettings: undefined, layout: undefined},
                    isReady: true
                })
                cb()
            })
        ipcRenderer.send(ROUTES.LOAD_PROJECT_METADATA)
    }

    static async loadLevel(level = PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL) {
        await RegistryAPI.readRegistry()
        if (LevelController.#loadedLevel === level) {
            alert.pushAlert("Level already loaded")
            return
        }
        LevelController.#loadedLevel = level
        const IPC = ROUTES.LOAD_LEVEL
        let pathToLevel
        if (level === PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL) {
            pathToLevel = NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL
            EngineStore.engine.currentLevel = undefined
        } else {
            const {registryID} = level
            try {
                const reg = RegistryAPI.getRegistryEntry(registryID)
                if (!reg)
                    throw new Error("Error loading level")
                pathToLevel = NodeFS.ASSETS_PATH + NodeFS.sep + reg.path
                EngineStore.engine.currentLevel = level
            } catch (err) {
                console.error(err)
            }
        }

        GPU.meshes.forEach(m => GPUAPI.destroyMesh(m))
        const materials = Array.from(GPU.materials.keys())
        for (let i = 0; i < materials.length; i++)
            GPUAPI.destroyMaterial(materials[i][1])

        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: undefined
        })
        ActionHistoryAPI.clear()
        ipcRenderer.on(
            CHANNELS.ENTITIES,
            async (_, data) => {
                const {entities} = data

                const mapped = []
                for (let i = 0; i < entities.length; i++) {
                    const entity = EntityAPI.parseEntityObject(entities[i])
                    for (let i = 0; i < entity.scripts.length; i++)
                        await componentConstructor(entity, entity.scripts[i].id, false)
                    const imgID = entity.components.get(COMPONENTS.SPRITE)?.imageID
                    checkTexture: if (imgID) {
                        const textures = GPU.textures
                        if (textures.get(imgID) != null && Object.values(STATIC_TEXTURES).find(v => v === imgID) != null)
                            break checkTexture
                        await EngineStore.loadTextureFromImageID(imgID)
                    }

                    const uiID = entity.components.get(COMPONENTS.UI)?.uiLayoutID
                    if (uiID) {
                        const rs = RegistryAPI.getRegistryEntry(uiID)
                        Engine.UILayouts.set(uiID, await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path))
                    }
                    const terrain = entity.components.get(COMPONENTS.TERRAIN)
                    if (terrain) {
                        const {materialID, terrainID} = terrain
                        if (GPU.meshes.get(terrainID) == null) {
                            const rs = RegistryAPI.getRegistryEntry(terrainID)
                            if (!rs)
                                continue
                            const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path, "json")
                            if (!file)
                                continue
                            const terrainData = await TerrainWorker.generate(file.image, file.scale, file.dimensions)
                            GPUAPI.allocateMesh(terrainID, terrainData)
                        }
                        if (materialID && GPU.materials.get(materialID) == null) {
                            const rs = RegistryAPI.getRegistryEntry(materialID)
                            if (!rs)
                                continue
                            const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path, "json")
                            if (!file)
                                continue
                            GPUAPI.allocateMaterialInstance(file, materialID).catch()
                        }
                    }

                    mapped.push(entity)
                }
                dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
            })

        ipcRenderer.on(
            CHANNELS.MESH,
            (ev, data) => {
                console.log(data)
                GPUAPI.allocateMesh(data.id, data)
            })

        ipcRenderer.on(
            CHANNELS.MATERIAL,
            async (ev, data) => {
                if (data?.result != null)
                    GPUAPI.allocateMaterial({
                        ...data.result,
                        fragment: data.result.shader,
                        vertex: data.result.vertexShader
                    }, data.id)
                else if (data != null)
                    await loadMaterial(data.id, () => null)
            })

        ipcRenderer.send(IPC, pathToLevel)
    }

    static async save() {
        alert.pushAlert(Localization.SAVING, "info")
        try {
            const entities = Engine.entities
            const metadata = EngineStore.engine.meta

            await FilesAPI.writeFile(
                NodeFS.path + NodeFS.sep + PROJECT_FILE_EXTENSION,
                JSON.stringify({
                    ...metadata,
                    settings: {
                        ...SettingsStore.data,
                        camera: {
                            ...SettingsStore.data.camera,
                            serialization: CameraAPI.serializeState(),
                            xRotation: CameraTracker.xRotation,
                            yRotation: CameraTracker.yRotation,
                        },
                    },
                    layout: TabsStore.data,
                    visualSettings: VisualsStore.data,
                }), true)

            let pathToWrite
            pathElse:if (!EngineStore.engine.currentLevel)
                pathToWrite = NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL
            else {
                const reg = RegistryAPI.getRegistryEntry(EngineStore.engine.currentLevel.registryID)
                if (!reg) {
                    alert.pushAlert("Level not found, a new one will be created.", "alert")
                    pathToWrite = (new Date()).toDateString() + " (fallback-level).level"
                    break pathElse
                }
                pathToWrite = NodeFS.ASSETS_PATH + NodeFS.sep + reg.path
            }
            pathToWrite = NodeFS.resolvePath(pathToWrite)
            await FilesAPI.writeFile(
                pathToWrite,
                serializeStructure({
                    entities: entities.map(e => e.serializable())
                }),
                true
            )
        } catch (err) {
            console.error(err)
            return
        }
        alert.pushAlert("Project saved", "success")


    }

}



