import useEngine from "../engine-extension/useEngine"
import useSerializer from "./useSerializer"
import {useContext, useEffect, useRef, useState} from "react"
import EVENTS from "../../static/misc/EVENTS"
import ProjectLoader from "../templates/ProjectLoader"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import GPUContextProvider from "../components/viewport/hooks/GPUContextProvider"
import MeshInstance from "../engine/instances/MeshInstance"
import {v4} from "uuid"
import CHANNELS from "../../../public/static/CHANNELS"

const {ipcRenderer} = window.require("electron")
export default function useProjectWrapper(id,  settings, pushSettingsBlock, load) {

    const engine = useEngine(settings)
    const initialized = useRef(false)
    const {gpu} = useContext(GPUContextProvider)
    const [filesLoaded, setFilesLoaded] = useState([])
    const serializer = useSerializer(engine, settings, id)
    const [openTab, setOpenTab] = useState(0)

    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (gpu && !initialized.current) {
            initialized.current = true
            const listenID = v4().toString()
            ipcRenderer.once(CHANNELS.META_DATA + "-" + listenID, async (ev, res) => {
                if (res.settings && res.settings.data)
                    pushSettingsBlock({
                        ...res.settings.data,
                        name: res.meta?.data?.name
                    })
                const entities = await Promise.all(res.entities.map(e => e ? ProjectLoader.mapEntity(e.data, gpu) : undefined).filter(e => e))
                engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: entities})

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

            ipcRenderer.send(CHANNELS.SEND, {projectPath: document.fileSystem.path, projectID: id, listenID})
        }
    }, [gpu])





    return {
        settings,
        setFilesLoaded,
        serializer, engine,
        filesLoaded,
        openTab, setOpenTab
    }
}