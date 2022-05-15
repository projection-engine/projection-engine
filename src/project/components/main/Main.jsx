import styles from "../../styles/Project.module.css";
import ViewportOptions from "../../../components/viewport/ViewportOptions";
import Viewport from "../../../components/viewport/Viewport";
import handleDrop from "../../utils/handleDrop";
import ResizableBar from "../../../components/resizable/ResizableBar";
import SceneView from "../scene/SceneView";

import getOptions from "../../utils/getOptions";
import {useContext, useEffect} from "react";
import QuickAccessProvider from "../../hooks/QuickAccessProvider";
import PropTypes from "prop-types";
import ControlProvider from "../../../components/tabs/components/ControlProvider";
import useEditorKeys from "../../hooks/useEditorKeys";

export default function Main(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const controlProvider = useContext(ControlProvider)

    useEffect(() => {
        controlProvider.setTabAttributes(
            getOptions(
                props.executingAnimation,
                props.setExecutingAnimation,
                props.engine,
                props.serializer.save,
                props.openLevelBlueprint,
                props.setAlert
            ),
            'Level viewport',
            <span
                style={{fontSize: '1.2rem'}}
                className={`material-icons-round`}>video_settings</span>,
            (newTab) => {
                if (newTab === 0)
                    props.engine.setCanRender(true)
                else
                    props.engine.setCanRender(false)
            },
            false,
            0
        )

    }, [props.executingAnimation, props.engine])
    useEditorKeys(props, controlProvider)
    return (
        <div className={styles.viewportWrapper} id={props.id + '-editor-wrapper'}>
            <div id={'fullscreen-element-' + props.id}
                 className={styles.container}>
                {props.settings.viewportOptionsVisibility ?
                    <ViewportOptions
                        engine={props.engine}
                        executingAnimation={props.executingAnimation}
                        id={props.id}
                        fullscreenID={'fullscreen-element-' + props.id}
                    />
                    :
                    null
                }
                <Viewport
                    id={props.id}
                    engine={props.engine}
                    showPosition={props.settings.cameraCoordsVisibility}
                    allowDrop={true}
                    handleDrop={e => handleDrop(e, quickAccess.fileSystem, props.engine, props.setAlert, props.load)}
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

Main.propTypes = {
    load: PropTypes.object,
    setExecutingAnimation: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    serializer: PropTypes.object.isRequired,
    openLevelBlueprint: PropTypes.func
}