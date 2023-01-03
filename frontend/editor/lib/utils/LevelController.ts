import FilesAPI from "../fs/FilesAPI"
import UndoRedoAPI from "./UndoRedoAPI";
import Engine from "../../../../engine-core/Engine";
import RegistryAPI from "../fs/RegistryAPI";
import GPU from "../../../../engine-core/GPU";
import COMPONENTS from "../../../../engine-core/static/COMPONENTS.js";
import componentConstructor from "../../utils/component-constructor";

import EngineStore from "../../stores/EngineStore";
import SelectionStore from "../../stores/SelectionStore";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities";
import SettingsStore from "../../stores/SettingsStore";
import VisualsStore from "../../stores/VisualsStore";
import SETTINGS from "../../../static/SETTINGS";
import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import TabsStore from "../../stores/TabsStore";
import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
import GPUAPI from "../../../../engine-core/lib/rendering/GPUAPI";
import serializeStructure from "../../../../engine-core/utils/serialize-structure";
import EntityAPI from "../../../../engine-core/lib/utils/EntityAPI";
import NodeFS from "../../../lib/FS/NodeFS";
import ROUTES from "../../../../backend/static/ROUTES";
import PROJECT_STATIC_DATA from "../../../../static/objects/PROJECT_STATIC_DATA";
import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import ErrorLoggerAPI from "../fs/ErrorLoggerAPI";
import UIComponent from "../../../../engine-core/templates/components/UIComponent";
import SpriteComponent from "../../../../engine-core/templates/components/SpriteComponent";
import AlertController from "../../../components/alert/AlertController";
import ChangesTrackerStore from "../../stores/ChangesTrackerStore";
import MutableObject from "../../../../engine-core/MutableObject";

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
                if (meta.settings !== undefined) {
                    const newSettings = {...SETTINGS, ...meta.settings}

                    if (newSettings.views[0].top == null)
                        newSettings.views = SETTINGS.views
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

    static async loadLevel(level:string|{registryID:string}= PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL) {
        await RegistryAPI.readRegistry()
        if (LevelController.#loadedLevel === level) {
            AlertController.warn(LOCALIZATION_EN.LEVEL_ALREADY_LOADED)
            return
        }
        LevelController.#loadedLevel = level
        const IPC = ROUTES.LOAD_LEVEL
        let pathToLevel
        if (level === PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL) {
            pathToLevel = NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL
            EngineStore.engine.currentLevel = undefined
        } else {
            const {registryID} = <{registryID:string}> level
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

        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: undefined
        })
        UndoRedoAPI.clear()
        ipcRenderer.on(
            ROUTES.ENTITIES,
            async (_, data) => {
                const {entities} = data

                const mapped = []
                for (let i = 0; i < entities.length; i++) {
                    const entity = EntityAPI.parseEntityObject(entities[i])
                    for (let i = 0; i < entity.scripts.length; i++)
                        await componentConstructor(entity, entity.scripts[i].id, false)
                    const imgID = (<SpriteComponent>entity.components.get(COMPONENTS.SPRITE))?.imageID
                    checkTexture: if (imgID) {
                        const textures = GPU.textures
                        if (textures.get(imgID) != null)
                            break checkTexture
                        await EngineStore.loadTextureFromImageID(imgID)
                    }

                    const uiID = (<UIComponent|undefined>entity.components.get(COMPONENTS.UI))?.uiLayoutID
                    if (uiID) {
                        const rs = RegistryAPI.getRegistryEntry(uiID)
                        Engine.UILayouts.set(uiID, await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + rs.path))
                    }
                    mapped.push(entity)
                }
                dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
            })

        ipcRenderer.send(IPC, pathToLevel)
    }

    static async save() {
        if(!ChangesTrackerStore.data)
            return
        ChangesTrackerStore.updateStore(false)
        if(EngineStore.engine.executingAnimation){
            AlertController.warn(LOCALIZATION_EN.EXECUTING_SIMULATION)
            return
        }
        await ErrorLoggerAPI.save()
        AlertController.warn(LOCALIZATION_EN.SAVING)
        try {
            const entities = Engine.entities
            const metadata = EngineStore.engine.meta
            const settings =  {...SettingsStore.data}
            const tabIndexViewport = TabsStore.getValue("viewport")
            const viewMetadata = <MutableObject|undefined>settings.views[settings.currentView].viewport[tabIndexViewport]
            if(viewMetadata !== undefined) {
                viewMetadata.cameraMetadata = CameraAPI.serializeState()
                viewMetadata.cameraMetadata.prevX = CameraTracker.xRotation
                viewMetadata.cameraMetadata.prevY = CameraTracker.yRotation
            }

            await FilesAPI.writeFile(
                NodeFS.path + NodeFS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION,
                JSON.stringify({
                    ...metadata,
                    settings,
                    layout: TabsStore.data,
                    visualSettings: VisualsStore.data,
                }), true)

            let pathToWrite
            pathElse:if (!EngineStore.engine.currentLevel)
                pathToWrite = NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL
            else {
                const reg = RegistryAPI.getRegistryEntry(EngineStore.engine.currentLevel.registryID)
                if (!reg) {
                    AlertController.warn(LOCALIZATION_EN.LEVEL_NOT_FOUND)
                    pathToWrite = (new Date()).toDateString() + " (fallback-level).level"
                    break pathElse
                }
                pathToWrite = NodeFS.ASSETS_PATH + NodeFS.sep + reg.path
            }
            pathToWrite = NodeFS.resolvePath(pathToWrite)

            await FilesAPI.writeFile(
                pathToWrite,
                serializeStructure({
                    entities: entities.map(e => e.serializable()),
                }),
                true
            )
        } catch (err) {
            console.error(err)
            return
        }
        AlertController.success(LOCALIZATION_EN.PROJECT_SAVED)


    }

}



