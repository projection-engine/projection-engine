import useEngine from "../engine-extension/useEngine"
import useSerializer from "./useSerializer"
import {useEffect, useRef} from "react"
import EVENTS from "../../static/misc/EVENTS"
import ProjectLoader from "../utils/ProjectLoader"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import MeshInstance from "../engine/instances/MeshInstance"
import {v4} from "uuid"
import CHANNELS from "../../../public/static/CHANNELS"
import Entity from "../engine/basic/Entity"
import COMPONENTS from "../engine/templates/COMPONENTS"
import MeshComponent from "../engine/components/MeshComponent"
import TransformComponent from "../engine/components/TransformComponent"
import MaterialComponent from "../engine/components/MaterialComponent"

const {ipcRenderer} = window.require("electron")
export default function useProjectWrapper(id,  settings, pushSettingsBlock, load, worker) {

    const engine = useEngine(settings, worker)
    const initialized = useRef(false)
    const serializer = useSerializer(engine, settings, id)

    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (engine.initialized && !initialized.current) {
            initialized.current = true
            const listenID = v4()
            ipcRenderer.once(
                CHANNELS.META_DATA + "-" + listenID, 
                async (ev, res) => {

                    if (res.settings && res.settings.data)
                        pushSettingsBlock({
                            ...res.settings.data,
                            name: res.meta?.data?.name
                        })
                    try{
                        let entities = await Promise.all(res.entities.map(e => e ? ProjectLoader.mapEntity(e.data) : undefined).filter(e => e))

                        // TEMP - DESENV
                        entities = []
                        for(let i =0; i < 2000; i++){
                            const e = new Entity()
                            e.name = i  + "- ENTITY"
                            e.components[COMPONENTS.MESH] = new MeshComponent()
                            e.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                            e.components[COMPONENTS.MATERIAL] = new MaterialComponent()
                            entities.push(e)
                        }
                        // TEMP - DESENV
                        
                        engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: entities})
                    }catch (err){
                        console.error(err)
                    }
                    load.finishEvent(EVENTS.PROJECT_DATA)
                })
            ipcRenderer.on(CHANNELS.MESH + "-" + listenID, (ev, res) => {
                engine.setMeshes(prev => {
                    return [...prev, new MeshInstance(res)]
                })
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
    }, [engine.initialized])


    return {
        serializer,
        engine,
    }
}