import PropTypes from "prop-types";
import styles from './styles/Mesh.module.css'

import Viewport from "../../components/viewport/Viewport";
import Controls from "./components/Controls";


import useVisualizer, {initializeMesh} from "./hook/useVisualizer";
import ResizableBar from "../../components/resizable/ResizableBar";
import {useContext, useEffect, useMemo} from "react";


import ControlProvider from "../../components/tabs/components/ControlProvider";
import LoadProvider from "../../pages/project/hook/LoadProvider";
import EVENTS from "../../pages/project/utils/misc/EVENTS";

import QuickAccessProvider from "../../pages/project/hook/QuickAccessProvider";

export default function MeshView(props) {
    const engine = useVisualizer(false, false)
    const load = useContext(LoadProvider)
    const quickAccess = useContext(QuickAccessProvider)
    useEffect(() => {
        if (engine.initialized) {
            load.pushEvent(EVENTS.LOADING_VIEWPORT)
            quickAccess.fileSystem.readRegistryFile(props.file.registryID)
                .then(res => {
                    quickAccess.fileSystem.readFile(quickAccess.fileSystem.path + '\\assets\\' + res.path, 'json')
                        .then(fileData => {
                            load.finishEvent(EVENTS.LOADING_VIEWPORT)
                            initializeMesh(fileData, engine.gpu, engine.id, props.file.name, engine.dispatchEntities, engine.setMeshes, true)
                        })
                })
        }
    }, [engine.initialized])

    const controlProvider = useContext(ControlProvider)
    const options = useMemo(() => {
        return [
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
        ]
    }, [engine.entities, engine.materials])

    useEffect(() => {
        if (controlProvider.tab === props.index) {
            controlProvider.setTabAttributes(
                options,
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
    }, [options, controlProvider.tab])

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
    index: PropTypes.number.isRequired,
    file: PropTypes.shape({
        fileID: PropTypes.string,
        name: PropTypes.string,
        blob: PropTypes.any,
        type: PropTypes.string,
    }),
    setAlert: PropTypes.func
}