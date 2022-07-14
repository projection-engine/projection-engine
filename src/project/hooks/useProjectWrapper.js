import useEngine from "../engine-extension/useEngine"
import useSerializer from "./useSerializer"
import {useEffect, useRef} from "react"
import EVENTS from "../../static/misc/EVENTS"
import ProjectLoader from "../libs/ProjectLoader"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import MeshInstance from "../engine/instances/MeshInstance"
import {v4} from "uuid"
import CHANNELS from "../../../public/static/CHANNELS"

const {ipcRenderer} = window.require("electron")
export default function useProjectWrapper(id,  settings, pushSettingsBlock, load) {

    const engine = useEngine(settings)
    const initialized = useRef(false)
    const serializer = useSerializer(settings, id)

    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (engine.viewportInitialized && !initialized.current) {
            initialized.current = true
            const listenID = v4()
            ipcRenderer.once(
                CHANNELS.META_DATA + "-" + listenID, 
                async (ev, res) => {

                    if (res.settings && res.settings.data)
                        pushSettingsBlock(res.settings.data)
                    try{
                        const entities = await Promise.all(res.entities.map(e => e ? ProjectLoader.mapEntity(e.data) : undefined).filter(e => e))
                        engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: entities})
                    }catch (err){
                        console.error(err)
                    }
                    load.finishEvent(EVENTS.PROJECT_DATA)
                })
            ipcRenderer.on(CHANNELS.MESH + "-" + listenID, (ev, res) => {

                engine.dispatchMeshes([new MeshInstance(res)])
            })
            ipcRenderer.on(CHANNELS.MATERIAL + "-" + listenID, (ev, res) => {
                ProjectLoader.mapMaterial(res.result, res.id)
                    .then(mat => engine.setMaterials(prev => {
                        return [...prev, mat]
                    }))
            })
            ipcRenderer.on(CHANNELS.CLEAN_UP + "-" + listenID, () => window.fileSystem.refresh())
            ipcRenderer.send(CHANNELS.SEND, {projectPath: window.fileSystem.path, projectID: id, listenID})
        }
    }, [engine.viewportInitialized])


    return {
        serializer,
        engine,
    }
}