import {useContext, useEffect, useMemo, useRef, useState} from "react";

import {Alert} from "@f-ui/core";
import styles from './styles/Project.module.css'

import Maker from "../../services/workers/Maker";

import useQuickAccess from "./hook/useQuickAccess";
import QuickAccessProvider from "./hook/QuickAccessProvider";
import PropTypes from "prop-types";
import Preferences from "../../components/preferences/Preferences";
import GlobalOptions from "../../components/options/GlobalOptions";
import Tabs from "../../components/tabs/Tabs";
import ViewportOptions from "../../components/viewport/ViewportOptions";
import Viewport from "../../components/viewport/Viewport";

import ResizableBar from "../../components/resizable/ResizableBar";
import SceneView from "../../views/scene/SceneView";

import ProjectLoader from "../../services/workers/ProjectLoader";
import {ENTITY_ACTIONS} from "../../services/engine/ecs/utils/entityReducer";
import useControl from "./hook/useControl";
import getOptions from "./utils/getOptions";
import useSerializer from "./hook/useSerializer";
import LoadProvider from "./hook/LoadProvider";
import useEngine from "./hook/useEngine";
import useSettings from "./hook/useSettings";
import EVENTS from "./utils/misc/EVENTS";
import useTabs from "./hook/useTabs";
import SettingsProvider from "./hook/SettingsProvider";
import handleDrop from "./utils/handleDrop";
import FilesView from "../../views/files/FilesView";


export default function Project(props) {
    const [executingAnimation, setExecutingAnimation] = useState(false)
    const [alert, setAlert] = useState({})
    const settings = useSettings()
    const engine = useEngine(props.id, executingAnimation, settings)
    const load = useContext(LoadProvider)
    const quickAccess = useQuickAccess(props.id, load)
    const serializer = useSerializer(engine, setAlert, settings, props.id, quickAccess)
    const fullscreenRef = useRef()

    useControl(engine, serializer.save, settings, fullscreenRef)

    const fallbackOptions = useMemo(() => {
        return getOptions(
            executingAnimation,
            setExecutingAnimation,
            engine,
            serializer.save)
    }, [executingAnimation, engine])

    const {
        meshes,
        images,
        materials, setFilesLoaded,
        currentTab, setCurrentTab
    } = useTabs(
        setAlert,
        quickAccess.fileSystem
    )

    useEffect(() => {
        if (engine.gpu) {
            load.pushEvent(EVENTS.PROJECT_DATA)
            ProjectLoader
                .loadProject(engine.gpu, quickAccess.fileSystem)
                .then(res => {
                    engine.setMeshes(res.meshes)
                    engine.setMaterials(res.materials)

                    res.entities.forEach(entity => {
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
                    })
                    if (res.settings)
                        Object.keys(res.settings.data).forEach(key => {
                            settings[key] = res.settings.data[key]
                            console.log(key, res.settings.data[key])
                        })
                    if (res.meta)
                        Object.keys(res.meta).forEach(key => {
                            settings[key] = res.meta[key]
                        })

                    load.finishEvent(EVENTS.PROJECT_DATA)
                })
                .catch(e => {
                    load.finishEvent(EVENTS.PROJECT_DATA)
                })
        }
    }, [engine.gpu])

    return (

        <SettingsProvider.Provider value={settings}>
            <QuickAccessProvider.Provider value={quickAccess}>
                <Alert
                    open={alert.type !== undefined}
                    handleClose={() => setAlert({})} variant={alert.type}
                    delay={3500}>
                    <div className={styles.alertContent} title={alert.message}>
                        {alert.message}
                    </div>
                </Alert>
                <div className={styles.wrapper}>
                    <Preferences serializer={serializer}/>
                    <GlobalOptions
                        downloadProject={() => {
                            Maker.make(props.id, load, setAlert)

                        }}

                        redirect={props.redirect}
                        save={serializer.save}
                    />

                    <Tabs
                        fallbackOptions={fallbackOptions}
                        onBeforeSwitch={(newTab) => {
                            if (newTab === 0)
                                props.engine.setCanRender(true)
                            else
                                props.engine.setCanRender(false)
                        }}
                        tab={currentTab} setTab={setCurrentTab}
                        tabs={[
                            {
                                open: true,
                                icon: <span
                                    style={{fontSize: '1.2rem'}}
                                    className={`material-icons-round`}>video_settings</span>,
                                label: 'Viewport',
                                children: (
                                    <div className={styles.viewportWrapper}>

                                        <div
                                            ref={fullscreenRef}
                                            style={{
                                                position: 'relative',
                                                width: '100%',
                                                height: '100%',
                                                overflow: 'hidden'
                                            }}>
                                            {settings.viewportOptionsVisibility ?
                                                <ViewportOptions
                                                    engine={engine}
                                                    id={props.id}
                                                />
                                                :
                                                null}

                                            <Viewport
                                                id={props.id}
                                                engine={engine}
                                                allowDrop={true}
                                                handleDrop={event => handleDrop(event, quickAccess.fileSystem, engine, setAlert)}
                                            />
                                        </div>
                                        {settings.sceneVisibility ?
                                            <>
                                                <ResizableBar type={'width'}/>
                                                <SceneView
                                                    executingAnimation={executingAnimation}
                                                    hierarchy={engine.hierarchy}
                                                    setAlert={setAlert}
                                                    engine={engine}
                                                />
                                            </> : null}

                                    </div>
                                )
                            },
                            ...materials,
                            ...meshes,
                            ...images
                        ]}
                    />

                    {settings.filesVisibility ?
                        <FilesView
                            setAlert={setAlert}
                            currentTab={currentTab}
                            label={'FilesView'} id={props.id}
                            openEngineFile={(fileID, fileName) => {
                                load.pushEvent(EVENTS.LOAD_FILE)
                                quickAccess.fileSystem.readRegistryFile(fileID)
                                    .then(res => {
                                        if (res) {

                                            load.finishEvent(EVENTS.LOAD_FILE)
                                            setFilesLoaded(prev => {
                                                return [
                                                    ...prev,
                                                    {
                                                        registryID: fileID,
                                                        type: res.path.split('.').pop(),
                                                        name: fileName
                                                    }
                                                ]
                                            })

                                        } else {
                                            load.finishEvent(EVENTS.LOAD_FILE)
                                            setAlert({
                                                type: 'error',
                                                message: 'Could not load file.'
                                            })
                                        }
                                    })
                            }}
                        />
                        :
                        null}
                </div>
            </QuickAccessProvider.Provider>
        </SettingsProvider.Provider>

    )
}

Project.propTypes = {
    redirect: PropTypes.func.isRequired,
    id: PropTypes.string
}