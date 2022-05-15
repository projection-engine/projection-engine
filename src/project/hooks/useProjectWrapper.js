import {AlertProvider} from "@f-ui/core";
import LoaderProvider from "../../components/loader/LoaderProvider";
import useEditorEngine from "../engine-editor/useEditorEngine";
import useQuickAccess from "./useQuickAccess";
import useSerializer from "./useSerializer";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import EVENTS from "../utils/EVENTS";
import ProjectLoader from "../utils/workers/ProjectLoader";
import {ENTITY_ACTIONS} from "../engine/useEngineEssentials";
import COMPONENTS from "../engine/templates/COMPONENTS";
import WebBuilder from "../utils/builder/WebBuilder";
import GPUContextProvider from "../../components/viewport/hooks/GPUContextProvider";

export default function useProjectWrapper(id, initialized, setInitialized, settings) {
    const [executingAnimation, setExecutingAnimation] = useState(false)
    const alert = useContext(AlertProvider)
    const setAlert = ({type, message}) => {
        alert.pushAlert(message, type)
    }
    const {gpu} = useContext(GPUContextProvider)

    const load = useContext(LoaderProvider)
    const [loading, setLoading] = useState(false)
    const engine = useEditorEngine(executingAnimation, settings, load, initialized, setAlert)
    const quickAccess = useQuickAccess(id, load)
    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)
    const serializer = useSerializer(engine, setAlert, settings, id, quickAccess, currentTab)

    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (gpu && !loading) {
            setLoading(true)
            new Promise(async resolve => {
                try {
                    console.log('G')
                    const res = await ProjectLoader.loadProject(gpu, quickAccess.fileSystem)
                    load.finishEvent(EVENTS.PROJECT_DATA)

                    engine.setScripts(res.scripts)
                    engine.setMeshes(res.meshes)
                    engine.setMaterials(res.materials)
                    engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: res.entities})
                    if (res.settings && res.settings.data)
                        Object.keys(res.settings.data).forEach(key => {
                            settings[key] = res.settings.data[key]
                        })
                    if (res.meta && res.meta.data)
                        settings.name = res.meta.data.name
                    setLoading(false)
                } catch (error) {
                }
                setInitialized(true)
                resolve()
            }).catch()
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