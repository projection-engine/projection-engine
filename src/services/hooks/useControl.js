import {useEffect, useState} from "react";
import MeshComponent from "../engine/ecs/components/MeshComponent";
import MaterialComponent from "../engine/ecs/components/MaterialComponent";
import PickComponent from "../engine/ecs/components/PickComponent";
import TransformComponent from "../engine/ecs/components/TransformComponent";
import {ENTITY_ACTIONS} from "../engine/ecs/utils/entityReducer";
import Entity from "../engine/ecs/basic/Entity";

export const KEYS = {
    Backspace: "Backspace",
    Tab: "Tab",
    Enter: "Enter",
    ShiftLeft: "ShiftLeft",
    ShiftRight: "ShiftRight",
    ControlLeft: "ControlLeft",
    ControlRight: "ControlRight",
    AltLeft: "AltLeft",
    AltRight: "AltRight",
    Pause: "Pause",
    CapsLock: "CapsLock",
    Escape: "Escape",
    Space: "Space",
    PageUp: "PageUp",
    PageDown: "PageDown",
    End: "End",
    Home: "Home",
    ArrowLeft: "ArrowLeft",
    ArrowUp: "ArrowUp",
    ArrowRight: "ArrowRight",
    ArrowDown: "ArrowDown",
    PrintScreen: "PrintScreen",
    Insert: "Insert",
    Delete: "Delete",
    Digit0: "Digit0",
    Digit1: "Digit1",
    Digit2: "Digit2",
    Digit3: "Digit3",
    Digit4: "Digit4",
    Digit5: "Digit5",
    Digit6: "Digit6",
    Digit7: "Digit7",
    Digit8: "Digit8",
    Digit9: "Digit9",
    KeyA: "KeyA",
    KeyB: "KeyB",
    KeyC: "KeyC",
    KeyD: "KeyD",
    KeyE: "KeyE",
    KeyF: "KeyF",
    KeyG: "KeyG",
    KeyH: "KeyH",
    KeyI: "KeyI",
    KeyJ: "KeyJ",
    KeyK: "KeyK",
    KeyL: "KeyL",
    KeyM: "KeyM",
    KeyN: "KeyN",
    KeyO: "KeyO",
    KeyP: "KeyP",
    KeyQ: "KeyQ",
    KeyR: "KeyR",
    KeyS: "KeyS",
    KeyT: "KeyT",
    KeyU: "KeyU",
    KeyV: "KeyV",
    KeyW: "KeyW",
    KeyX: "KeyX",
    KeyY: "KeyY",
    KeyZ: "KeyZ",
    MetaLeft: "MetaLeft",
    MetaRight: "MetaRight",
    ContextMenu: "ContextMenu",
    Numpad0: "Numpad0",
    Numpad1: "Numpad1",
    Numpad2: "Numpad2",
    Numpad3: "Numpad3",
    Numpad4: "Numpad4",
    Numpad5: "Numpad5",
    Numpad6: "Numpad6",
    Numpad7: "Numpad7",
    Numpad8: "Numpad8",
    Numpad9: "Numpad9",
    NumpadMultiply: "NumpadMultiply",
    NumpadAdd: "NumpadAdd",
    NumpadSubtract: "NumpadSubtract",
    NumpadDecimal: "NumpadDecimal",
    NumpadDivide: "NumpadDivide",
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    NumLock: "NumLock",
    ScrollLock: "ScrollLock",
    AudioVolumeMute: "AudioVolumeMute",
    AudioVolumeDown: "AudioVolumeDown",
    AudioVolumeUp: "AudioVolumeUp",
    LaunchMediaPlayer: "LaunchMediaPlayer",
    LaunchApplication1: "LaunchApplication1",
    LaunchApplication2: "LaunchApplication2",
    Semicolon: "Semicolon",
    Equal: "Equal",
    Comma: "Comma",
    Minus: "Minus",
    Period: "Period",
    Slash: "Slash",
    Backquote: "Backquote",
    BracketLeft: "BracketLeft",
    Backslash: "Backslash",
    BracketRight: "BracketRight",
    Quote: "Quote"
}

export default function useControl(engine, save, settings, fullscreenRef) {
    const [toClone, setToClone] = useState()
    let isCtrl = false, isShift = false, isAlt = false
    let clicked = {}
    const handleKey = (e) => {

        if (e.type === 'keydown') {
            clicked[e.code] = true

            if (e.key === 'Control')
                isCtrl = true
            if (e.key === 'Shift')
                isShift = true
            if (e.key === 'Alt')
                isAlt = true
            if (engine.selectedElement && e.key === 'Delete')
                engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE, payload: {entityID: engine.selectedElement}})
            if (e.key === 's' && isCtrl && !isAlt && !isShift) {
                e.preventDefault()
                // save()
            }

            if (e.key === 'c' && isCtrl && !isAlt && !isShift) {
                e.preventDefault()
                if (engine.selectedElement)
                    setToClone(engine.selectedElement)
            }

            if (e.key === 'v' && isCtrl && toClone) {
                const currentElement = engine.entities.find(e => e.id === toClone)
                const clone = new Entity(undefined, currentElement.name + ' - copy')

                // TODO - OTIMIZAR ISSO
                clone.components.MeshComponent = new MeshComponent(undefined, currentElement.components.MeshComponent.meshID)
                clone.components.MaterialComponent = new MaterialComponent()
                clone.components.MaterialComponent.materialID = currentElement.components.MaterialComponent.materialID
                clone.components.MaterialComponent.name = currentElement.components.MaterialComponent.name

                clone.components.PickComponent = new PickComponent(undefined, engine.entities.length + 1)
                clone.components.TransformComponent = new TransformComponent()
                clone.components.TransformComponent.rotation = currentElement.components.TransformComponent.rotation
                clone.components.TransformComponent.translation = currentElement.components.TransformComponent.translation
                clone.components.TransformComponent.scaling = currentElement.components.TransformComponent.scaling


                engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                engine.setSelectedElement(clone.id)
                setToClone(undefined)

            }
            if (e.key === 's' && isCtrl && isAlt) {
                e.preventDefault()
                settings.viewPreferences = true
            }
            if (e.key.toLowerCase() === 'h' && isCtrl && isShift) {
                e.preventDefault()
                settings.fpsVisibility = !settings.fpsVisibility
            }

            if (e.key.toLowerCase() === 'f' && isCtrl && isShift) {
                e.preventDefault()
                settings.fullscreen = !settings.fullscreen
            }
        } else {
            delete clicked[e.code]

            if (e.key === 'Control')
                isCtrl = false
            if (e.key === 'Shift')
                isShift = false
            if (e.key === 'Alt')
                isAlt = false
        }
    }

    const handleFullscreen = () => {
        if (!document.fullscreenElement)
            settings.fullscreen = false
    }
    useEffect(() => {
        if (settings.fullscreen) {
            fullscreenRef.current?.requestFullscreen()
            document.addEventListener('fullscreenchange', handleFullscreen)
        } else if (document.fullscreenElement)
            document.exitFullscreen().catch()
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreen)
        }
    }, [settings.fullscreen, fullscreenRef])


    useEffect(() => {
        setToClone(undefined)
    }, [engine.selectedElement])
    useEffect(() => {
        document.addEventListener('keydown', handleKey)
        document.addEventListener('keyup', handleKey)
        return () => {
            document.removeEventListener('keyup', handleKey)
            document.removeEventListener('keydown', handleKey)
        }
    }, [engine.entities, engine.selectedElement, settings, toClone])
}

