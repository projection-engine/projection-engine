import PropTypes from "prop-types";
import styles from './styles/Mesh.module.css'

import Viewport from "../../components/viewport/Viewport";
import Controls from "./components/Controls";


import useMinimalEngine, {IDS, initializeMesh} from "../../engine/hooks/useMinimalEngine";
import ResizableBar from "../../components/resizable/ResizableBar";
import {useContext, useEffect, useState} from "react";
import ControlProvider from "../../components/tabs/components/ControlProvider";
import EVENTS from "../../pages/project/utils/EVENTS";
import QuickAccessProvider from "../../pages/project/hooks/QuickAccessProvider";
import VIEWER_TYPES from "./templates/VIEWER_TYPES";
import updateMeshFile from "./utils/updateMeshFile";
import LoaderProvider from "../../components/loader/LoaderProvider";

export default function MeshView(props) {
    const engine = useMinimalEngine(false, false, false, false)
    const load = useContext(LoaderProvider)
    const quickAccess = useContext(QuickAccessProvider)
    const type = props.file.type
    const controlProvider = useContext(ControlProvider)
    const [meshData, setMeshData] = useState({})

    useEffect(() => {
        if (engine.initialized && type !== VIEWER_TYPES.TERRAIN) {
            load.pushEvent(EVENTS.LOADING_VIEWPORT)
            quickAccess.fileSystem.readRegistryFile(props.file.registryID)
                .then(res => {
                    quickAccess.fileSystem.readFile(quickAccess.fileSystem.path + '\\assets\\' + res.path, 'json')
                        .then(fileData => {
                            load.finishEvent(EVENTS.LOADING_VIEWPORT)
                            initializeMesh(fileData, engine.gpu, IDS.TARGET, props.file.name, engine.dispatchEntities, engine.setMeshes, true)
                        })
                })
        }
    }, [engine.initialized])

    useEffect(() => {
        if (controlProvider.tab === props.index) {
            controlProvider.setTabAttributes(
                [ {
                    label: 'Save',
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                    onClick: () => {
                        updateMeshFile(quickAccess.fileSystem, props.file.registryID, meshData)
                    }
                },
                    {
                        label: 'Save & close',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,
                        onClick: () => {
                            updateMeshFile(quickAccess.fileSystem, props.file.registryID, meshData)
                            props.handleClose()
                        }
                    }],
                props.file.name,
                <span
                    style={{fontSize: '1.2rem'}}
                    className={`material-icons-round`}>view_in_ar</span>,
                (newTab) => {
                    if (newTab === props.index)
                        engine.setCanRender(true)
                    else
                        engine.setCanRender(false)
                },
                true,
                props.index
            )
        }
    }, [meshData, controlProvider.tab])


    return (
        <div className={styles.wrapper}>

            <div style={{width: '100%', height: '100%'}}>
                <Viewport allowDrop={false} id={engine.id} engine={engine} renderer={engine.renderer}/>
            </div>
            <ResizableBar type={'width'}/>
            <Controls meshData={meshData} setMeshData={setMeshData} engine={engine} load={load}/>
        </div>
    )
}
MeshView.propTypes = {
    handleClose: PropTypes.func,
    index: PropTypes.number.isRequired,
    file: PropTypes.shape({
        fileID: PropTypes.string,
        name: PropTypes.string,
        blob: PropTypes.any,
        type: PropTypes.oneOf(['mesh', 'terrain']),
    })
}