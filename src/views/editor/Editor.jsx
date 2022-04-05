import styles from "../../pages/project/styles/Project.module.css";
import ViewportOptions from "../../components/viewport/ViewportOptions";
import Viewport from "../../components/viewport/Viewport";
import handleDrop from "../../services/utils/handleDrop";
import ResizableBar from "../../components/resizable/ResizableBar";
import SceneView from "../scene/SceneView";

import getOptions from "../../pages/project/utils/getOptions";
import {useContext, useEffect, useState} from "react";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";
import useHotKeys, {KEYS} from "../../services/hooks/useHotKeys";
import PropTypes from "prop-types";
import ControlProvider from "../../components/tabs/components/ControlProvider";
import cloneClass from "../../services/utils/misc/cloneClass";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import PickComponent from "../../services/engine/ecs/components/PickComponent";
import generateNextID from "../../services/utils/generateNextID";
import GIZMOS from "../../services/engine/templates/GIZMOS";
import {HISTORY_ACTIONS} from "../../services/utils/historyReducer";

import {v4 as uuidv4} from 'uuid';

export default function Editor(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const controlProvider = useContext(ControlProvider)

    useEffect(() => {
        controlProvider.setTabAttributes(
            getOptions(
                props.executingAnimation,
                props.setExecutingAnimation,
                props.engine,
                props.serializer.save,
                props.openLevelBlueprint
            ),
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

    }, [props.executingAnimation, props.engine])
    const [toCopy, setToCopy] = useState([])
    useHotKeys({
        focusTarget: props.id + '-editor-wrapper',
        disabled: controlProvider.tab !== 0 || props.engine.canExecutePhysicsAnimation,
        actions: [
            {require: [KEYS.ControlLeft, KEYS.KeyS], callback: () => props.serializer.save()},
            {require: [KEYS.KeyG], callback: () => props.settings.gizmo = GIZMOS.TRANSLATION},
            {require: [KEYS.KeyS], callback: () => props.settings.gizmo = GIZMOS.SCALE},
            {require: [KEYS.KeyR], callback: () => props.settings.gizmo = GIZMOS.ROTATION},
            {require: [KEYS.Escape], callback: () => props.setExecutingAnimation(false)},

            {require: [KEYS.ControlLeft, KEYS.KeyZ], callback: () => props.engine.returnChanges()},
            {require: [KEYS.ControlLeft, KEYS.KeyY], callback: () => props.engine.forwardChanges()},

            {
                require: [KEYS.ControlLeft, KEYS.KeyC],
                callback: () => {
                    setToCopy(props.engine.selected)
                    if (props.engine.selected)
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
                    if (el) {
                        if (!document.fullscreenElement)
                            el.requestFullscreen()
                        else
                            document.exitFullscreen()
                    }
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyH],
                callback: () => props.settings.performanceMetrics = !props.settings.performanceMetrics
            },
            {
                require: [KEYS.Delete],
                callback: () => {
                    const s = [...props.engine.selected]
                    props.engine.setSelected([])
                    props.engine.setLockedEntity(undefined)
                    props.engine.dispatchChanges({
                        type: HISTORY_ACTIONS.DELETING_ENTITIES,
                        payload: {entitiesToDelete: s, entities: props.engine.entities}
                    })
                    s.forEach(e => {
                        props.engine.dispatchEntities({
                            type: ENTITY_ACTIONS.REMOVE,
                            payload: {entityID: e}
                        })
                    })
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.KeyV],
                callback: () => {
                    toCopy.forEach(t => {
                        const found = props.engine.entities.find(e => e.id === t)
                        if (found) {
                            let clone = cloneClass(found)
                            clone.id = uuidv4()
                            clone.name += ' - clone'
                            let newComponents = {}
                            Object.keys(clone.components).forEach(c => {
                                const cClone = cloneClass(clone.components[c])
                                cClone.id = uuidv4()
                                if (cClone instanceof PickComponent)
                                    cClone.pickID = generateNextID(props.engine.entities.length + 1)
                                newComponents[c] = cClone
                            })
                            clone.components = newComponents
                            props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                        } else
                            props.setAlert({
                                type: 'info',
                                message: 'Nothing to paste.'
                            })
                    })
                }
            }
        ]
    })


    return (
        <div className={styles.viewportWrapper} id={props.id + '-editor-wrapper'}>

            <div id={'fullscreen-element-' + props.id}
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
                    handleDrop={event => handleDrop(event, quickAccess.fileSystem, props.engine, props.setAlert, props.load)}
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