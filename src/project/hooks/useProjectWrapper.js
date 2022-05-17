import {AlertProvider} from "@f-ui/core";
import LoaderProvider from "../../components/loader/LoaderProvider";
import useEditorEngine from "../utils/extension/useEditorEngine";
import useQuickAccess from "./useQuickAccess";
import useSerializer from "./useSerializer";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import EVENTS from "../utils/EVENTS";
import ProjectLoader from "../utils/workers/ProjectLoader";
import {ENTITY_ACTIONS} from "../engine/useEngineEssentials";
import COMPONENTS from "../engine/templates/COMPONENTS";
import WebBuilder from "../utils/builder/WebBuilder";
import GPUContextProvider from "../../components/viewport/hooks/GPUContextProvider";
import {getCall} from "../../components/AsyncFS";
import MeshInstance from "../engine/instances/MeshInstance";
import {v4} from "uuid";
import CHANNELS from "../../../public/project/loader/CHANNELS";

export default function useProjectWrapper(id, initialized, setInitialized, settings) {
    const [executingAnimation, setExecutingAnimation] = useState(false)
    const alert = useContext(AlertProvider)
    const setAlert = ({type, message}) => {
        alert.pushAlert(message, type)
    }
    const {gpu} = useContext(GPUContextProvider)

    const load = useContext(LoaderProvider)
    const [loading, setLoading] = useState(false)
    const engine = useEditorEngine(executingAnimation, settings,  initialized, setAlert)
    const quickAccess = useQuickAccess(id, load)
    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)
    const serializer = useSerializer(engine, setAlert, settings, id, quickAccess, currentTab)

    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (gpu && !loading) {
            setLoading(true)
            const {ipcRenderer} = window.require('electron')


            const listenID = v4().toString()
            ipcRenderer.once(CHANNELS.META_DATA + '-' + listenID, async (ev, res) => {
                if (res.settings && res.settings.data)
                    Object.keys(res.settings.data).forEach(key => {
                        settings[key] = res.settings.data[key]
                    })
                if (res.meta && res.meta.data)
                    settings.name = res.meta.data.name
                const entities = await Promise.all(res.entities.map(e => ProjectLoader.mapEntity(e.data, gpu, quickAccess.fileSystem)))
                engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: entities})

                setInitialized(true)
                setLoading(false)
                load.finishEvent(EVENTS.PROJECT_DATA)
            })
            ipcRenderer.on(CHANNELS.MESH + '-' + listenID, (ev, res) => {
                engine.setMeshes(prev => {
                    return [...prev, new MeshInstance({...res, gpu})]
                })
            })
            ipcRenderer.on(CHANNELS.MATERIAL + '-' + listenID, (ev, res) => {
                console.log(res.result)
                ProjectLoader.mapMaterial(res.result, gpu, res.id)
                    .then(mat => engine.setMaterials(prev => {
                        return [...prev, mat]
                    }))
            })
            ipcRenderer.once(CHANNELS.SCRIPTS + '-' + listenID, (ev, res) => {
                engine.setScripts(prev => {
                    return [...prev, res]
                })
            })
            ipcRenderer.send(CHANNELS.SEND, {projectPath: quickAccess.fileSystem.path, projectID: id, listenID})
        }
    }, [gpu])


    const openTab = useCallback((fileID, fileName) => {
        const found = filesLoaded.find(f => f.registryID === fileID)
        if (!found) {
            quickAccess.fileSystem.readRegistryFile(fileID)
                .then(res => {
                    engine.setCanRender(false)
                    if (res) {

                        setFilesLoaded(prev => {
                            return [
                                ...prev,
                                {registryID: fileID, type: res.path.split('.').pop(), name: fileName}
                            ]
                        })
                        setCurrentTab(filesLoaded.length + 1)
                    } else {

                        setAlert({
                            type: 'error',
                            message: 'Could not load file.'
                        })
                    }
                })
        } else
            setCurrentTab(filesLoaded.indexOf(found) + 1)
    }, [currentTab, filesLoaded])

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
    const exporter = useMemo(() => {
        if (quickAccess.fileSystem)
            return new WebBuilder(quickAccess.fileSystem)
        return undefined
    }, [])


    return {
        exporter, entitiesWithMeshes, openTab,
        load, settings,
        setAlert, setFilesLoaded,
        currentTab, setCurrentTab,
        serializer, engine,
        executingAnimation, setExecutingAnimation,
        quickAccess, filesLoaded
    }
}