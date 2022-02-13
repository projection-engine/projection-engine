import styles from "../../pages/project/styles/Project.module.css";
import ViewportOptions from "../../components/viewport/ViewportOptions";
import Viewport from "../../components/viewport/Viewport";
import handleDrop from "../../pages/project/utils/handleDrop";
import ResizableBar from "../../components/resizable/ResizableBar";
import SceneView from "../scene/SceneView";

import getOptions from "../../pages/project/utils/getOptions";
import {useContext, useEffect, useMemo, useRef} from "react";
import QuickAccessProvider from "../../pages/project/hook/QuickAccessProvider";
import useControl from "../../pages/project/hook/useControl";
import PropTypes from "prop-types";
import ControlProvider from "../../components/tabs/components/ControlProvider";

export default function Editor(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const fullscreenRef = useRef()

    const options = useMemo(() => {

        return getOptions(
            props.executingAnimation,
            props.setExecutingAnimation,
            props.engine,
            props.serializer.save
        )
    }, [props.executingAnimation, props.engine])
    const controlProvider = useContext(ControlProvider)
    useEffect(() => {

        controlProvider.setTabAttributes(
            options,
            'Editor',
            <span
                style={{fontSize: '1.2rem'}}
                className={`material-icons-round`}>video_settings</span>,
            (newTab) => {
                console.trace('HERE', newTab)
                if (newTab === 0)
                    props.engine.setCanRender(true)
                else
                    props.engine.setCanRender(false)
            },
            false,
            0
        )

    }, [options])

    useControl(props.engine, props.serializer.save, props.settings, fullscreenRef)


    return (
        <div className={styles.viewportWrapper}>
            <div
                ref={fullscreenRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }}>
                {props.settings.viewportOptionsVisibility ?
                    <ViewportOptions
                        engine={props.engine}
                        id={props.id}
                    />
                    :
                    null
                }

                <Viewport
                    id={props.id}
                    engine={props.engine}
                    allowDrop={true}
                    handleDrop={event => handleDrop(event, quickAccess.fileSystem, props.engine, props.setAlert)}
                />
            </div>
            {props.settings.sceneVisibility ?
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
}

Editor.propTypes = {

    setExecutingAnimation: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    serializer: PropTypes.object.isRequired
}