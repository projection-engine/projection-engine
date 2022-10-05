import FilesAPI from "../../shared/libs/FilesAPI"
import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import Engine from "../../../public/engine/production/Engine";
import RegistryAPI from "../../shared/libs/RegistryAPI";
import DEFAULT_LEVEL from "../../static/DEFAULT_LEVEL"
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
import FilesStore from "../stores/FilesStore";
import SelectionStore from "../stores/SelectionStore";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import SettingsStore from "../stores/SettingsStore";
import VisualsStore from "../stores/VisualsStore";
import SETTINGS from "../data/SETTINGS";

const {ipcRenderer} = window.require("electron")


export default class LevelController {
    static #loadedLevel = undefined
    static #initialized = false

    static initialize() {
        if (LevelController.#initialized)
            return
        LevelController.#initialized = true
        const projectID = sessionStorage.getItem("electronWindowID")
        const IPC = ROUTES.LOAD_PROJECT_METADATA + projectID
        return new Promise(resolve => {
            ipcRenderer.on(IPC, (ev, data) => {
                let meta = {}
                if (data?.meta)
                    meta = data.meta.data
                if (meta.settings != null)
                    SettingsStore.updateStore({...SETTINGS, ...meta.settings})
                resolve(meta)
            })
            ipcRenderer.send(IPC)
        })
    }

    static async loadLevel(level = DEFAULT_LEVEL) {

        if (LevelController.#loadedLevel === level) {
            alert.pushAlert("Level already loaded")
            return
        }
        LevelController.#loadedLevel = level
        const projectID = sessionStorage.getItem("electronWindowID")
        const IPC = ROUTES.LOAD_LEVEL + projectID
        let pathToLevel
        if (level === DEFAULT_LEVEL) {
            pathToLevel = FilesAPI.path + FilesAPI.sep + DEFAULT_LEVEL
            EngineStore.engine.currentLevel = undefined
        } else {
            const {registryID} = level
            try {
                const reg = await RegistryAPI.readRegistryFile(registryID)
                if (!reg)
                    throw new Error("Error loading level")
                pathToLevel = FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path
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
            CHANNELS.ENTITIES + projectID,
            async (_, data) => {

                const {entities, visualSettings} = data
                console.log(data)
                if(visualSettings)
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
                        Engine.UILayouts.set(uiID, await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path))
                    }
                    const terrain = entity.components.get(COMPONENTS.TERRAIN)

                    if (terrain) {
                        const {materialID, terrainID} = terrain
                        if (GPU.meshes.get(terrainID) == null) {
                            const rs = await RegistryAPI.readRegistryFile(terrainID)
                            if (!rs)
                                continue
                            const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path, "json")
                            if (!file)
                                continue
                            const terrainData = await TerrainWorker.generate(file.image, file.scale, file.dimensions)
                            GPU.allocateMesh(terrainID, terrainData)
                        }
                        if (materialID && GPU.materials.get(materialID) == null) {
                            const rs = await RegistryAPI.readRegistryFile(materialID)
                            if (!rs)
                                continue
                            const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path, "json")
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
            CHANNELS.MESH + projectID,
            (ev, data) => GPU.allocateMesh(data.id, data))

        ipcRenderer.on(
            CHANNELS.MATERIAL + projectID,
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
        const metaData = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + ".meta", "json")
        if (!metaData) {
            console.error(new Error("Metadata not found"))
            return
        }
        await FilesAPI.writeFile(FilesAPI.path + FilesAPI.sep + ".meta", {
            ...metaData,
            settings: SettingsStore.data
        }, true)
        let pathToWrite
        pathElse:if (!EngineStore.engine.currentLevel)
            pathToWrite = FilesAPI.path + FilesAPI.sep + DEFAULT_LEVEL
        else {
            const reg = await RegistryAPI.readRegistryFile(EngineStore.engine.currentLevel.registryID)
            if (!reg) {
                alert.pushAlert("Level not found, a new one will be created.", "alert")
                pathToWrite = (new Date()).toDateString() + " (fallback-level).level"
                break pathElse
            }
            pathToWrite = FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path)
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



