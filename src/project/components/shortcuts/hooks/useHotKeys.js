import {useContext, useEffect, useRef} from "react"
import PropTypes from "prop-types"
import HotKeysProvider from "./HotKeysProvider"
import KEYS from "../../../engine/templates/KEYS"

export default function useHotKeys({
    focusTargetLabel,
    focusTargetIcon,
    focusTarget,
    actions,
    disabled
}) {
    let clicked = {}
    const shortcuts = useContext(HotKeysProvider)
    const focused = useRef(false)
    let mousedown = false
    function handler(e){
        switch (e.type){
        case "mousedown":
            mousedown = true
            break
        case "mouseup":
            mousedown = false
            break
        case "mouseleave":
            if(!mousedown) {
                focused.current = false
                clicked = {}
            }
            break
        case "mouseenter":
            if(!mousedown) {
                focused.current = true

                if (shortcuts.window?.reference !== e.target)
                    shortcuts.window = {
                        reference: e.target,
                        label: focusTargetLabel,
                        icon: focusTargetIcon
                    }
                clicked = {}
            }
            break
        default:
            if ((focused.current  || shortcuts.window?.reference === e.target) && document.activeElement === document.body) {
                const l = actions.length
                if (e.type === "keydown") {
                    if(e.ctrlKey) {
                        clicked[KEYS.ControlLeft] = true
                        clicked[KEYS.ControlRight] = true
                    }

                    clicked[e.code] = true
                    for (let i = 0; i < l; i++) {
                        const a = actions[i]
                        let trigger = true
                        a.require.forEach(r => {
                            trigger = trigger && clicked[r]
                        })
                        if (trigger && !a.disabled && a.callback !== undefined) {
                            a.callback()
                        }
                    }
                } else
                    delete clicked[e.code]

                shortcuts.active = clicked
            }
            break
        }
    }

    useEffect(() => {
        const target =  typeof focusTarget === "object" ? focusTarget : document.getElementById(focusTarget)
        if (!disabled && target) {
            if(focused.current)
                shortcuts.all = actions
            target?.addEventListener("mouseenter", handler)
            target?.addEventListener("mouseleave", handler)

            document.addEventListener("mouseup", handler)
            document.addEventListener("mousedown", handler)
            document.addEventListener("keydown", handler)
            document.addEventListener("keyup", handler)
        }
        return () => {
            target?.removeEventListener("mouseenter", handler)
            target?.removeEventListener("mouseleave", handler)

            document.removeEventListener("mouseup", handler)
            document.removeEventListener("mousedown", handler)
            document.removeEventListener("keyup", handler)
            document.removeEventListener("keydown", handler)
        }
    }, [actions, disabled, shortcuts.window])
}

