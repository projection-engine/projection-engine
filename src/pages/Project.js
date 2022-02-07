import {useContext, useEffect, useRef, useState} from "react";

import {Alert, ThemeContext} from "@f-ui/core";
import styles from './styles/Project.module.css'
import useSettings from "../views/editor/hook/useSettings";
import useEngine from "../views/editor/hook/useEngine";
import LoadProvider from "../views/editor/hook/LoadProvider";
import useSerializer from "../views/editor/hook/useSerializer";
import Database from "../components/db/Database";
import EVENTS from "../views/editor/utils/misc/EVENTS";
import Maker from "../services/workers/Maker";
import loadProject, {loadEntities} from "../views/editor/utils/parsers/loadProjectData";
import DatabaseProvider from "../components/db/DatabaseProvider";
import Editor from "../views/editor/Editor";
import SettingsProvider from "../views/editor/hook/SettingsProvider";
import useQuickAccess from "../components/db/useQuickAccess";
import QuickAccessProvider from "../components/db/QuickAccessProvider";
import PropTypes from "prop-types";


export default function Project(props) {

    const [executingAnimation, setExecutingAnimation] = useState(false)
    const [alert, setAlert] = useState({})

    const settings = useSettings()
    const engine = useEngine(props.id, executingAnimation, settings)
    const [database, setDatabase] = useState()
    const load = useContext(LoadProvider)
    const packageMaker = useRef()
    const theme = useContext(ThemeContext)
    const serializer = useSerializer(engine, database, setAlert, settings, props.id)
    const files = useQuickAccess(props.id, load, database)

    useEffect(() => {
        setDatabase(new Database('FS'))
    }, [])

    useEffect(() => {
        if (database && props.id) {

            load.pushEvent(EVENTS.PROJECT_SETTINGS)
            load.pushEvent(EVENTS.PROJECT_DATA)
            if (!packageMaker.current)
                packageMaker.current = new Maker()

            loadProject(
                database,
                engine,
                settings,
                setAlert,
                props.id,
                () => props.redirect(),
                () => {

                    load.finishEvent(EVENTS.PROJECT_SETTINGS)
                })
        }
    }, [database, id])
    useEffect(() => {
        if (engine.gpu && database)
            loadEntities(database, engine, id, () => {
                load.finishEvent(EVENTS.PROJECT_DATA)
            })
    }, [engine.gpu])


    return (
        <DatabaseProvider.Provider value={database}>
            <SettingsProvider.Provider value={settings}>
                <QuickAccessProvider.Provider value={files}>

                    {/*<Head>*/}
                    {/*    <title>{settings.projectName}</title>*/}
                    {/*</Head>*/}
                    <Alert
                        open={alert.type !== undefined}
                        handleClose={() => setAlert({})} variant={alert.type}
                        delay={3500}>
                        <div className={styles.alertContent} title={alert.message}>
                            {alert.message}
                        </div>
                    </Alert>
                    <Editor
                        {...serializer}
                        load={load}
                        redirect={() => props.redirect()}
                        executingAnimation={executingAnimation}
                        setExecutingAnimation={setExecutingAnimation}
                        theme={theme}
                        packageMaker={packageMaker}
                        engine={engine}
                        setAlert={setAlert}
                        id={props.id}/>
                </QuickAccessProvider.Provider>
            </SettingsProvider.Provider>
        </DatabaseProvider.Provider>
    )
}

Project.propTypes={
    redirect: PropTypes.func.isRequired,
    id: PropTypes.string
}