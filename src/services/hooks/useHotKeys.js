import {useEffect, useState} from "react";
import PropTypes from "prop-types";

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

export default function useHotKeys(props) {
    let clicked = {}
    const [focused, setFocused] = useState(false)
    const handleKey = (e) => {
      if(focused){
          if (e.type === 'keydown') {
              clicked[e.code] = true

              props.actions.forEach(a => {

                  let trigger = true
                  a.require.forEach(r => {
                      trigger = trigger && clicked[r]
                  })

                  if (trigger)
                      a.callback()
              })
          } else {

              delete clicked[e.code]
          }
      }
    }
    const handleMouseDown = (event) => {
        const target = typeof props.focusTarget === 'string' ? document.getElementById(props.focusTarget) : props.focusTarget

        if (target && document.elementsFromPoint(event.clientX, event.clientY).includes(target))
            setFocused(true)
        else
            setFocused(false)
    }

    useEffect(() => {

        if (!props.disabled) {
            document.addEventListener('mousedown', handleMouseDown)
            document.addEventListener('keydown', handleKey)
            document.addEventListener('keyup', handleKey)
        }
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('keyup', handleKey)
            document.removeEventListener('keydown', handleKey)
        }
    }, [props.actions, props.disabled, props.focusTarget, focused])
}
useHotKeys.propTypes = {
    focusTarget: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        require: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(KEYS))),
        callback: PropTypes.func
    })),
    disabled: PropTypes.bool,
}