import GIZMOS from "../../../static/misc/GIZMOS"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import {useMemo, useState} from "react"
import KEYS from "../../../engine/data/KEYS"
import RENDER_TARGET from "../../../static/misc/RENDER_TARGET"
import useHotKeys from "../../shortcuts/hooks/useHotKeys"

export default function useEditorShortcuts({engine, settings, id, serializer}) {
    const [toCopy, setToCopy] = useState([])

    function copy(single, target) {
        setToCopy(target ? target : (single ? [engine.selected[0]] : engine.selected))
        alert.pushAlert( `Entities copied (${engine.selected.length}).`, "info")
    }
    function deleteSelected(){
        const s = [...engine.selected]
        engine.setSelected([])
        engine.setLockedEntity(undefined)
        engine.dispatchEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: s
        })
    }

    function invertSelection(){
        const newArr = []
        const notValid = {}
        for(let i in engine.selected)
            notValid[engine.selected[i]] = true
        const entities = window.renderer.entities

        for(let i = 0; i < entities.length; i++ ){
            if(!notValid[entities[i].id])
                newArr.push(entities[i].id)
        }
        engine.setSelected(newArr)
    }
    function paste(parent) {
        let block = []
        toCopy.forEach(t => {
            const found = window.renderer.entitiesMap.get(t)
            if (found) {
                const clone = found.clone()
                clone.parent = window.renderer.entitiesMap.get(parent)
                block.push(clone)
            }
        })
        engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        engine.setSelected(block.map(b => b.id))
        alert.pushAlert(`Pasted ${toCopy.length} entities.`, "info")
    }
    function group() {
        setToCopy(engine.selected)
        if (engine.selected.length > 1)
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: engine.selected
            })
    }

    const actions = useMemo(() => {
        return [
            {
                label: "Invert selection",
                require: [KEYS.ControlLeft, KEYS.KeyI],
                callback: invertSelection
            },
            {
                label: "Select all",
                require: [KEYS.KeyA],
                callback: () => engine.setSelected(window.renderer.entities.filter(e => !e.isFolder).map(e => e.id))
            },
            {
                label: "Select",
                require: [KEYS.Mouse0]
            },
            {
                label: "Select Multiple",
                require: [KEYS.ControlLeft, KEYS.Mouse0]
            },
            {label: "Save", require: [KEYS.ControlLeft, KEYS.KeyS], callback: () => serializer()},
            {label: "Translate", require: [KEYS.KeyG], callback: () => settings.gizmo = GIZMOS.TRANSLATION},
            {label: "Scale", require: [KEYS.KeyS], callback: () => settings.gizmo = GIZMOS.SCALE},
            {label: "Rotate", require: [KEYS.KeyR], callback: () => settings.gizmo = GIZMOS.ROTATION},
            {
                label: "Undo",
                require: [KEYS.ControlLeft, KEYS.KeyZ],
                callback: () => engine.returnChanges()
            },
            {
                label: "Redo",
                require: [KEYS.ControlLeft, KEYS.KeyY],
                callback: () => engine.forwardChanges()
            },
            {
                label: "Group",
                disabled: engine.selected.length === 0,
                require: [KEYS.ControlLeft, KEYS.KeyP],
                callback: group
            },
            {label: "Fixate active",
                require: [KEYS.ControlLeft, KEYS.KeyF],
                callback: () => {
                    if(engine.selected[0])
                        engine.setLockedEntity(engine.selected[0])
                }
            },

            {
                label: "Copy",
                disabled: !engine.selectedEntity,
                require: [KEYS.ControlLeft, KEYS.KeyC],
                callback: copy
            },
            {label: "Fullscreen",
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyF],
                callback: () => {
                    const el = document.getElementById("fullscreen-element-" + id)
                    if (el) {
                        if (!document.fullscreenElement)
                            el.requestFullscreen().catch(() => document.exitFullscreen())
                        else
                            document.exitFullscreen().catch()
                    }
                }
            },
            {
                label: "Toggle metrics",
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyH],
                callback: () => settings.performanceMetrics = !settings.performanceMetrics
            },
            {
                label: "Delete",
                disabled: !engine.selectedEntity,
                require: [KEYS.Delete],
                callback:  deleteSelected
            },
            {
                label: "Paste",
                disabled: toCopy.length === 0,
                require: [KEYS.ControlLeft, KEYS.KeyV],
                callback: paste
            },
            {
                label: "Rotate camera",
                require: [KEYS.Mouse1]
            }
        ]
    }, [
        toCopy,
        engine.selected,
        settings
    ])


    useHotKeys({
        focusTargetLabel: "Viewport",
        focusTargetIcon: "window",
        focusTarget: RENDER_TARGET,
        disabled: engine.executingAnimation === true,
        actions
    })

    return {
        toCopy,
        group,
        copy,
        paste,
        invertSelection,
        deleteSelected
    }
}