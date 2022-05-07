import useHotKeys from "./useHotKeys";
import GIZMOS from "../engine/editor/gizmo/GIZMOS";
import {HISTORY_ACTIONS} from "./historyReducer";
import {ENTITY_ACTIONS} from "../engine/useEngineEssentials";
import cloneClass from "../engine/utils/cloneClass";
import {v4 as uuidv4} from "uuid";
import {useState} from "react";
import COMPONENTS from "../engine/templates/COMPONENTS";
import TransformComponent from "../engine/components/TransformComponent";
import KEYS from "../engine/templates/KEYS";

export default function useEditorKeys(props, controlProvider) {
    const [toCopy, setToCopy] = useState([])
    useHotKeys({
        focusTarget: props.id + '-editor-wrapper',
        disabled: controlProvider.tab !== 0 || props.executingAnimation === true,
        actions: [
            {require: [KEYS.ControlLeft, KEYS.KeyS], callback: () => props.serializer.save()},
            {require: [KEYS.KeyG], callback: () => props.settings.gizmo = GIZMOS.TRANSLATION},
            {require: [KEYS.KeyS], callback: () => props.settings.gizmo = GIZMOS.SCALE},
            {require: [KEYS.KeyR], callback: () => props.settings.gizmo = GIZMOS.ROTATION},
            {require: [KEYS.Escape], callback: () => props.setExecutingAnimation(false)},

            {require: [KEYS.ControlLeft, KEYS.KeyZ], callback: () => props.engine.returnChanges()},
            {require: [KEYS.ControlLeft, KEYS.KeyY], callback: () => props.engine.forwardChanges()},

            {
                require: [KEYS.ControlLeft, KEYS.KeyP],
                callback: () => {
                    setToCopy(props.engine.selected)
                    if (props.engine.selected.length > 1)
                        props.engine.dispatchEntities({
                            type: ENTITY_ACTIONS.LINK_MULTIPLE,
                            payload: props.engine.selected
                        })
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.KeyC],
                callback: () => {
                    setToCopy(props.engine.selected)
                    props.setAlert({
                        type: 'info',
                        message: `Entities copied (${props.engine.selected.length}).`
                    })
                }
            },
            {
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyF],
                callback: () => {
                    const el = document.getElementById('fullscreen-element-' + props.id)
                    if (el) {
                        if (!document.fullscreenElement)
                            el.requestFullscreen().catch(() => document.exitFullscreen())
                        else
                            document.exitFullscreen().catch()
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
                    let block = []
                    toCopy.forEach((t, index) => {
                        const found = props.engine.entities.find(e => e.id === t)
                        if (found) {
                            let clone = cloneClass(found)
                            clone.id = uuidv4()
                            clone.name += ' - clone'
                            let newComponents = {}
                            Object.keys(clone.components).forEach(c => {
                                if (c === COMPONENTS.TRANSFORM) {
                                    newComponents[COMPONENTS.TRANSFORM] = new TransformComponent()
                                    newComponents[COMPONENTS.TRANSFORM].rotation = [...clone.components[c].rotation]
                                    newComponents[COMPONENTS.TRANSFORM].rotationQuat = [...clone.components[c].rotationQuat]
                                    newComponents[COMPONENTS.TRANSFORM].translation = [...clone.components[c].translation]
                                    newComponents[COMPONENTS.TRANSFORM].scaling = [...clone.components[c].scaling]
                                    newComponents[COMPONENTS.TRANSFORM]._transformationMatrix = [...clone.components[c]._transformationMatrix]
                                    newComponents[COMPONENTS.TRANSFORM].lockedRotation = clone.components[c].lockedRotation
                                    newComponents[COMPONENTS.TRANSFORM].lockedScaling = clone.components[c].lockedScaling
                                    newComponents[COMPONENTS.TRANSFORM].updateQuatOnEulerChange = clone.components.updateQuatOnEulerChange
                                } else {
                                    const cClone = cloneClass(clone.components[c])
                                    cClone.id = uuidv4()
                                    newComponents[c] = cClone
                                }
                            })
                            delete clone.components
                            clone.components = newComponents
                            block.push(clone)
                        }
                    })


                    props.engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
                    props.engine.setSelected(block.map(b => b.id))
                    props.setAlert({
                        type: 'info',
                        message: `Pasted ${toCopy.length} entities.`
                    })
                }
            }
        ]
    }, [toCopy])
}