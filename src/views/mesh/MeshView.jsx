import PropTypes from "prop-types";
import styles from './styles/Mesh.module.css'

import Viewport from "../../components/viewport/Viewport";
import Controls from "./components/Controls";


import useVisualizer, {initializeMesh} from "./hook/useVisualizer";
import ResizableBar from "../../components/resizable/ResizableBar";
import {useContext, useEffect} from "react";
import DatabaseProvider from "../../components/db/DatabaseProvider";
import LoadProvider from "../editor/hook/LoadProvider";
import EVENTS from "../editor/utils/misc/EVENTS";
import ControlProvider from "../../components/tabs/components/ControlProvider";

export default function MeshView(props) {
    const engine = useVisualizer(false, false)
    const database = useContext(DatabaseProvider)
    const load = useContext(LoadProvider)
    useEffect(() => {
        if (engine.initialized) {
            load.pushEvent(EVENTS.LOADING_VIEWPORT)
            database.getFileWithBlob(props.file.fileID)
                .then(res => {

                    load.finishEvent(EVENTS.LOADING_VIEWPORT)
                    initializeMesh(JSON.parse(res.blob), engine.gpu, engine.id, res.name, engine.dispatchEntities, engine.setMeshes, true)
                })
        }
    }, [engine.initialized])

    const toolBarContext = useContext(ControlProvider)
    useEffect(() => {
        toolBarContext.setOptions([
            {
                label: 'Save',

                icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                onClick: () => {

                }
            },
            {
                label: 'Save & close',
                icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,
                onClick: () => {

                }
            }
        ])
    }, [engine.entities, engine.materials])


    return (
        <div className={styles.wrapper}>
            <div style={{width: '100%', height: '100%'}}><Viewport allowDrop={false} id={engine.id} engine={engine}/>
            </div>
            <ResizableBar type={'width'}/>
            <Controls engine={engine}/>
        </div>
    )
}
MeshView.propTypes = {
    file: PropTypes.shape({
        fileID: PropTypes.string,
        name: PropTypes.string,
        blob: PropTypes.any,
        type: PropTypes.string,
    }),
    setAlert: PropTypes.func
}