import useEngine from "../engine-extension/useEngine"
import useSerializer from "./useSerializer"
import {useContext, useEffect, useMemo, useState} from "react"
import EVENTS from "../../static/misc/EVENTS"
import ProjectLoader from "../templates/ProjectLoader"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import COMPONENTS from "../engine/templates/COMPONENTS"
import GPUContextProvider from "../components/viewport/hooks/GPUContextProvider"
import MeshInstance from "../engine/instances/MeshInstance"
import {v4} from "uuid"
import CHANNELS from "../../../public/project/loader/CHANNELS"

export default function useProjectWrapper(id, initialized, setInitialized, settings, pushSettingsBlock, load) {

    const engine = useEngine(settings, initialized, id)
    const {gpu} = useContext(GPUContextProvider)
    const [loading, setLoading] = useState(false)
    const [filesLoaded, setFilesLoaded] = useState([])
    const serializer = useSerializer(engine, settings, id)
    const [openTab, setOpenTab] = useState(0)
    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (gpu && !loading) {
            setLoading(true)
            const {ipcRenderer} = window.require("electron")
            const listenID = v4().toString()

            ipcRenderer.once(CHANNELS.META_DATA + "-" + listenID, async (ev, res) => {
                if (res.settings && res.settings.data)
                    pushSettingsBlock({
                        ...res.settings.data,
                        name: res.meta?.data?.name
                    })
                const entities = await Promise.all(res.entities.map(e => e ? ProjectLoader.mapEntity(e.data, gpu) : undefined).filter(e => e))
                engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: entities})

                setInitialized(true)
                setLoading(false)
                load.finishEvent(EVENTS.PROJECT_DATA)
            })
            ipcRenderer.on(CHANNELS.MESH + "-" + listenID, (ev, res) => {
                engine.setMeshes(prev => {
                    return [...prev, new MeshInstance({...res, gpu})]
                })
            })
            ipcRenderer.on(CHANNELS.MATERIAL + "-" + listenID, (ev, res) => {

                ProjectLoader.mapMaterial(res.result, gpu, res.id)
                    .then(mat => engine.setMaterials(prev => {
                        return [...prev, mat]
                    }))
            })
            ipcRenderer.once(CHANNELS.SCRIPTS + "-" + listenID, (ev, res) => {
                engine.setScripts(prev => {
                    return [...prev, ...res.map(s => s.script)]
                })
            })
            ipcRenderer.send(CHANNELS.SEND, {projectPath: document.fileSystem.path, projectID: id, listenID})
        }
    }, [gpu])


    const entitiesWithMeshes = useMemo(() => {
        return engine.entities.filter(e => {
            return (e.components.MeshComponent)
        }).map(e => {
            return {
                name: e.name,
                entity: e.id,
                mesh: e.components[COMPONENTS.MESH].meshID,
                material: engine.meshes.find(m => m.id === e.components[COMPONENTS.MESH].meshID)?.materialID
            }
        })
    }, [engine.entities])



    return {
        entitiesWithMeshes,
        settings,
        setFilesLoaded,
        serializer, engine,
        filesLoaded,
        openTab, setOpenTab
    }
}