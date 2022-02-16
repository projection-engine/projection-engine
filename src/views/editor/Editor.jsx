import styles from "../../pages/project/styles/Project.module.css";
import ViewportOptions from "../../components/viewport/ViewportOptions";
import Viewport from "../../components/viewport/Viewport";
import handleDrop from "../../pages/project/utils/handleDrop";
import ResizableBar from "../../components/resizable/ResizableBar";
import SceneView from "../scene/SceneView";

import getOptions from "../../pages/project/utils/getOptions";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";
import useHotKeys, {KEYS} from "../../services/hooks/useHotKeys";
import PropTypes from "prop-types";
import ControlProvider from "../../components/tabs/components/ControlProvider";
import cloneClass from "../../pages/project/utils/misc/cloneClass";
import randomID from "../../pages/project/utils/misc/randomID";
import {ENTITY_ACTIONS} from "../../services/engine/utils/entityReducer";

export default function Editor(props) {
    const quickAccess = useContext(QuickAccessProvider)


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
                if (newTab === 0)
                    props.engine.setCanRender(true)
                else
                    props.engine.setCanRender(false)
            },
            false,
            0
        )

    }, [options])
    const [toCopy, setToCopy] = useState()
    useHotKeys({
        disabled: controlProvider.tab !== 0,
        actions: [
            {
                require: [KEYS.ControlLeft, KEYS.KeyS],
                callback: () => {
                    props.serializer.save()
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.KeyC],
                callback: () => {
                    setToCopy(props.engine.selectedElement)
                    if (props.engine.selectedElement)
                        props.setAlert({
                            type: 'info',
                            message: 'Entity copied.'
                        })
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyF],
                callback: () => {
                    const el = document.getElementById('fullscreen-element-' + props.id)
                    if(el) {
                        if(!document.fullscreenElement)
                        el.requestFullscreen()
                        else
                            document.exitFullscreen()
                    }
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyH],
                callback: () => props.settings.fpsVisibility = !props.settings.fpsVisibility

            },
            {
                require: [KEYS.Delete],
                callback: () => {
                    if (props.engine.selectedElement) {
                        props.engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE, payload: {entityID: props.engine.selectedElement}})
                        props.setAlert({
                            type: 'success',
                            message: 'Entity deleted.'
                        })
                    }
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.KeyV],
                callback: () => {
                    const found = props.engine.entities.find(e => e.id === toCopy)
                    if (toCopy && found) {
                        let clone = cloneClass(found)
                        clone.id = randomID()

                        clone.name += ' - clone'

                        let newComponents = {}
                        Object.keys(clone.components).forEach(c => {
                            const cClone = cloneClass(clone.components[c])
                            cClone.id = randomID()
                            newComponents[c] = cClone
                        })
                        clone.components = newComponents
                        props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                    } else
                        props.setAlert({
                            type: 'info',
                            message: 'Nothing to paste.'
                        })
                }
            }
        ]
    })


    return (
        <div className={styles.viewportWrapper}>
            <div
                id={'fullscreen-element-' + props.id}
              className={styles.container}>
                {props.settings.viewportOptionsVisibility ?
                    <ViewportOptions
                        engine={props.engine}
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