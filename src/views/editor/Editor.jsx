import {useContext, useEffect, useMemo, useRef, useState} from "react";

import {Alert} from "@f-ui/core";

import handleDrop from "./utils/handleDrop";
import useTabs from "./hook/useTabs";
import getOptions from "./utils/getOptions";
import PropTypes from "prop-types";
import useControl from "./hook/useControl";
import DatabaseProvider from "../../components/db/DatabaseProvider";
import Preferences from "../../components/preferences/Preferences";
import GlobalOptions from "../../components/options/GlobalOptions";
import styles from './styles/Editor.module.css'
import ViewportOptions from "../../components/viewport/ViewportOptions";
import Viewport from "../../components/viewport/Viewport";
import ResizableBar from "../../components/resizable/ResizableBar";
import SceneView from "../scene/SceneView";
import Tabs from "../../components/tabs/Tabs";
import FilesView from "../files/FilesView";
import EVENTS from "./utils/misc/EVENTS";
import SettingsProvider from "./hook/SettingsProvider";

export default function Editor(props) {
    const settingsContext = useContext(SettingsProvider)
    const fullscreenRef = useRef()
    const database = useContext(DatabaseProvider)

    const handleFullscreen = e => {
        if (!document.fullscreenElement)
            settingsContext.fullscreen = false
    }
    useEffect(() => {
        if (settingsContext.fullscreen) {
            fullscreenRef.current?.requestFullscreen()
            document.addEventListener('fullscreenchange', handleFullscreen)
        } else if (document.fullscreenElement)
            document.exitFullscreen().catch()

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreen)
        }
    }, [settingsContext.fullscreen])
    useControl(props.engine, props.save, settingsContext)

    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)

    useEffect(() => {
        if (filesLoaded.length > 0)
            setCurrentTab(filesLoaded.length)
    }, [filesLoaded])

    const fallbackOptions = useMemo(() => {
        return getOptions(
            props.executingAnimation,
            props.setExecutingAnimation,
            props.engine,
            props.save)
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
        database,
        props.setAlert
    )


    return (

        <div className={styles.wrapper}>
            <Preferences  serializer={props.serializer}/>
            <GlobalOptions
                downloadProject={() => {
                    props.packageMaker.current.make(props.id, settingsContext, database, props.setAlert, props.load)
                }}

                redirect={props.redirect}
                save={props.save}
            />
            <Alert
                open={props.savingAlert}

                handleClose={() => props.setSavingAlert(false)}
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
                                    {settingsContext.viewportOptionsVisibility ?
                                        <ViewportOptions
                                            engine={props.engine}
                                            id={props.id}
                                        />
                                        :
                                        null}

                                    <Viewport
                                        id={props.id}
                                        engine={props.engine}
                                        allowDrop={true}
                                        handleDrop={event => handleDrop(event, database, props.engine, props.setAlert)}
                                    />
                                </div>
                                {settingsContext.sceneVisibility ?
                                    <>
                                        <ResizableBar type={'width'}/>
                                        <SceneView
                                            executingAnimation={props.executingAnimation}
                                            hierarchy={props.engine.hierarchy}
                                            setAlert={props.setAlert}
                                            engine={props.engine}
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

            {settingsContext.filesVisibility ?
                <FilesView
                    setAlert={props.setAlert}
                    currentTab={currentTab}
                    label={'FilesView'} id={props.id}
                    openEngineFile={(fileID, fileName) => {
                        if (!filesLoaded.find(file => file.fileID === fileID)) {
                            props.load.pushEvent(EVENTS.LOAD_FILE)
                            database.getFileWithBlob(fileID).then(res => {
                                setFilesLoaded(prev => [...prev, {
                                    blob: res.blob,
                                    name: fileName,
                                    fileID: fileID,
                                    type: res.type
                                }])
                                props.load.finishEvent(EVENTS.LOAD_FILE)
                            })
                        }
                    }}
                />
                :
                null}
        </div>

    )
}

Editor.propTypes = {
    redirect: PropTypes.func.isRequired,
    executingAnimation: PropTypes.bool.isRequired,
    setExecutingAnimation: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    engine: PropTypes.object.isRequired,
    id: PropTypes.string,
    packageMaker: PropTypes.object.isRequired,

    savingAlert: PropTypes.bool.isRequired,
    setSavingAlert: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
}
