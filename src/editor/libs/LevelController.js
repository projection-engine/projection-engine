import FilesAPI from "../../shared/libs/FilesAPI"
import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import Engine from "../../../public/engine/production/Engine";
import RegistryAPI from "../../shared/libs/RegistryAPI";

import ROUTES from "../../static/ROUTES";
import CHANNELS from "../../static/CHANNELS";
import GPU from "../../../public/engine/production/GPU";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.json";
import Entity from "../../../public/engine/production/instances/Entity";
import componentConstructor from "../libs/component-constructor";
import STATIC_TEXTURES from "../../../public/engine/static/resources/STATIC_TEXTURES";

import loadMaterial from "../libs/loader/utils/load-material";
import TerrainWorker from "../../../public/engine/workers/terrain/TerrainWorker";
import EngineStore from "../stores/EngineStore";
import SelectionStore from "../stores/SelectionStore";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import SettingsStore from "../stores/SettingsStore";
import VisualsStore from "../stores/VisualsStore";
import SETTINGS from "../data/SETTINGS";
import PROJECT_FOLDER_STRUCTURE from "../../static/PROJECT_FOLDER_STRUCTURE";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

const {ipcRenderer} = window.require("electron")


export default class LevelController {
    static #loadedLevel = undefined
    static #initialized = false

    static initialize() {
        if (LevelController.#initialized)
            return
        LevelController.#initialized = true

        ipcRenderer.once(
            ROUTES.LOAD_PROJECT_METADATA,
            (ev, data) => {
                console.trace(data)
                let meta = {}
                if (data?.meta)
                    meta = data.meta.data
                if (meta.settings != null)
                    SettingsStore.updateStore({...SETTINGS, ...meta.settings})
                EngineStore.updateStore({...EngineStore.engine, meta: {...meta, settings: undefined}, isReady: true})
            })
        ipcRenderer.send(ROUTES.LOAD_PROJECT_METADATA)
    }

    static async loadLevel(level = PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL) {

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
                const reg = await RegistryAPI.readRegistryFile(registryID)
                if (!reg)
                    throw new Error("Error loading level")
                pathToLevel = NodeFS.ASSETS_PATH + NodeFS.sep + reg.path
                EngineStore.engine.currentLevel = level
            } catch (err) {
                console.error(err)
            }
        }

        GPU.meshes.forEach(m => GPU.destroyMesh(m))
        const materials = Array.from(GPU.materials.keys())
        for (let i = 0; i < materials.length; i++)
            GPU.destroyMaterial(materials[i][1])

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

                const {entities, visualSettings} = data
                console.log(data)
                if (visualSettings)
                    VisualsStore.updateStore({...visualSettings})
                const mapped = []
                for (let i = 0; i < entities.length; i++) {
                    const entity = Entity.parseEntityObject(entities[i])
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
                        const rs = await RegistryAPI.readRegistryFile(uiID)
                        Engine.UILayouts.set(uiID, await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path))
                    }
                    const terrain = entity.components.get(COMPONENTS.TERRAIN)

                    if (terrain) {
                        const {materialID, terrainID} = terrain
                        if (GPU.meshes.get(terrainID) == null) {
                            const rs = await RegistryAPI.readRegistryFile(terrainID)
                            if (!rs)
                                continue
                            const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path, "json")
                            if (!file)
                                continue
                            const terrainData = await TerrainWorker.generate(file.image, file.scale, file.dimensions)
                            GPU.allocateMesh(terrainID, terrainData)
                        }
                        if (materialID && GPU.materials.get(materialID) == null) {
                            const rs = await RegistryAPI.readRegistryFile(materialID)
                            if (!rs)
                                continue
                            const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path, "json")
                            if (!file)
                                continue
                            GPU.allocateMaterialInstance(file, materialID).catch()
                        }
                    }

                    mapped.push(entity)
                }
                dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
            })

        ipcRenderer.on(
            CHANNELS.MESH,
            (ev, data) => GPU.allocateMesh(data.id, data))

        ipcRenderer.on(
            CHANNELS.MATERIAL,
            async (ev, data) => {
                if (data?.result != null)
                    GPU.allocateMaterial({
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
        alert.pushAlert("Saving editor", "info")
        const entities = Engine.entities
        const metaData = await FilesAPI.readFile(NodeFS.path + NodeFS.sep + ".meta", "json")
        if (!metaData) {
            console.error(new Error("Metadata not found"))
            return
        }
        await FilesAPI.writeFile(NodeFS.path + NodeFS.sep + ".meta", {
            ...metaData,
            settings: SettingsStore.data
        }, true)
        let pathToWrite
        pathElse:if (!EngineStore.engine.currentLevel)
            pathToWrite = NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL
        else {
            const reg = await RegistryAPI.readRegistryFile(EngineStore.engine.currentLevel.registryID)
            if (!reg) {
                alert.pushAlert("Level not found, a new one will be created.", "alert")
                pathToWrite = (new Date()).toDateString() + " (fallback-level).level"
                break pathElse
            }
            pathToWrite = FilesAPI.resolvePath(NodeFS.ASSETS_PATH  + NodeFS.sep + reg.path)
        }
        try {
            await FilesAPI.writeFile(
                pathToWrite,
                Entity.serializeComplexObject({
                    entities: entities.map(e => e.serializable()),
                    visualSettings: {...VisualsStore.data},
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



