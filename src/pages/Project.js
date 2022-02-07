import {useContext, useEffect, useMemo, useRef, useState} from "react";

import {Alert, ThemeContext} from "@f-ui/core";
import styles from './styles/Project.module.css'
import useSettings from "../views/editor/hook/useSettings";
import useEngine from "../views/editor/hook/useEngine";
import LoadProvider from "../views/editor/hook/LoadProvider";
import useSerializer from "../views/editor/hook/useSerializer";
import FileSystem from "../components/db/FileSystem";
import EVENTS from "../views/editor/utils/misc/EVENTS";
import Maker from "../services/workers/Maker";
import loadProject, {loadEntities} from "../views/editor/utils/parsers/loadProjectData";
import SettingsProvider from "../views/editor/hook/SettingsProvider";
import useQuickAccess from "../components/db/useQuickAccess";
import QuickAccessProvider from "../components/db/QuickAccessProvider";
import PropTypes from "prop-types";
import Preferences from "../components/preferences/Preferences";
import GlobalOptions from "../components/options/GlobalOptions";
import Tabs from "../components/tabs/Tabs";
import ViewportOptions from "../components/viewport/ViewportOptions";
import Viewport from "../components/viewport/Viewport";
import handleDrop from "../views/editor/utils/handleDrop";
import ResizableBar from "../components/resizable/ResizableBar";
import SceneView from "../views/scene/SceneView";
import FilesView from "../views/files/FilesView";
import useControl from "../views/editor/hook/useControl";
import getOptions from "../views/editor/utils/getOptions";
import useTabs from "../views/editor/hook/useTabs";


export default function Project(props) {

    const [executingAnimation, setExecutingAnimation] = useState(false)
    const [alert, setAlert] = useState({})

    const settings = useSettings()
    const engine = useEngine(props.id, executingAnimation, settings)
    const load = useContext(LoadProvider)
    const quickAccess = useQuickAccess(props.id, load)
    const serializer = useSerializer(engine, setAlert, settings, props.id)
    const fullscreenRef = useRef()

    const handleFullscreen = e => {
        if (!document.fullscreenElement)
            settings.fullscreen = false
    }
    useEffect(() => {
        if (settings.fullscreen) {
            fullscreenRef.current?.requestFullscreen()
            document.addEventListener('fullscreenchange', handleFullscreen)
        } else if (document.fullscreenElement)
            document.exitFullscreen().catch()

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreen)
        }
    }, [settings.fullscreen])
    useControl(engine, serializer.save, settings)
    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)
    useEffect(() => {
        if (filesLoaded.length > 0)
            setCurrentTab(filesLoaded.length)
    }, [filesLoaded])
    const fallbackOptions = useMemo(() => {
        return getOptions(
            executingAnimation,
            setExecutingAnimation,
            engine,
            serializer.save)
    }, [props])

    const {
        meshes,
        images,
        materials
    } = useTabs(
        filesLoaded,
        currentTab,
        setCurrentTab,
        setFilesLoaded,
        quickAccess.fileSystem,
        setAlert
    )

    useEffect(() => {
        if (props.id) {
            load.pushEvent(EVENTS.PROJECT_SETTINGS)
            load.pushEvent(EVENTS.PROJECT_DATA)


            loadProject(
                engine,
                settings,
                setAlert,
                props.id,
                () => props.redirect(),
                () => {

                    load.finishEvent(EVENTS.PROJECT_SETTINGS)
                })
        }
    }, [props.id])



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
                        <Preferences  serializer={serializer}/>
                        <GlobalOptions
                            downloadProject={() => {
                                Maker.make(props.id, settings,  setAlert, load)
                            }}

                            redirect={props.redirect}
                            save={serializer.save}
                        />
                        <Alert
                            open={serializer.savingAlert}

                            handleClose={() => serializer.setSavingAlert(false)}
                            onClick={() => props.save()} variant={'info'}
                            delay={5000}>
                            Saving project (2 min).
                        </Alert>

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
                                    if (!filesLoaded.find(file => file.fileID === fileID)) {
                                        load.pushEvent(EVENTS.LOAD_FILE)
                                        // database.getFileWithBlob(fileID).then(res => {
                                        //     setFilesLoaded(prev => [...prev, {
                                        //         blob: res.blob,
                                        //         name: fileName,
                                        //         fileID: fileID,
                                        //         type: res.type
                                        //     }])
                                        //     props.load.finishEvent(EVENTS.LOAD_FILE)
                                        // })
                                    }
                                }}
                            />
                            :
                            null}
                    </div>
                </QuickAccessProvider.Provider>
            </SettingsProvider.Provider>

    )
}

Project.propTypes={
    redirect: PropTypes.func.isRequired,
    id: PropTypes.string
}