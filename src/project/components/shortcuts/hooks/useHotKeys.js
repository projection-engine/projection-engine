import {useContext, useEffect, useRef} from "react"
import PropTypes from "prop-types"
import HotKeysProvider from "./HotKeysProvider"
import KEYS from "../../../engine/templates/KEYS"

export default function useHotKeys(props) {
    let clicked = {}
    const shortcuts = useContext(HotKeysProvider)
    const focused = useRef(false)

    function handler(e){
        switch (e.type){
        case "mouseleave":
            focused.current = false
            clicked = {}
            break
        case "mouseenter":
            focused.current = true
            if(shortcuts.window?.reference !== e.target)
                shortcuts.window ={
                    reference: e.target,
                    label: props.focusTargetLabel,
                    icon: props.focusTargetIcon
                }
            clicked = {}
            break
        default:
            if ((focused.current  || shortcuts.window?.reference === e.target) && document.activeElement === document.body) {
                const l = props.actions.length
                if (e.type === "keydown") {
                    if(e.ctrlKey) {
                        clicked[KEYS.ControlLeft] = true
                        clicked[KEYS.ControlRight] = true
                    }

                    clicked[e.code] = true
                    for (let i = 0; i < l; i++) {
                        const a = props.actions[i]
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
        const target =  typeof props.focusTarget === "object" ? props.focusTarget : document.getElementById(props.focusTarget)
        if (!props.disabled && target) {
            if(focused.current)
                shortcuts.all = props.actions
            target?.addEventListener("mouseenter", handler)
            target?.addEventListener("mouseleave", handler)
            document.addEventListener("keydown", handler)
            document.addEventListener("keyup", handler)
        }
        return () => {
            target?.removeEventListener("mouseenter", handler)
            target?.removeEventListener("mouseleave", handler)
            document.removeEventListener("keyup", handler)
            document.removeEventListener("keydown", handler)
        }
    }, [props.actions, props.disabled, shortcuts.window])
}

useHotKeys.propTypes = {
    focusTargetLabel: PropTypes.string,
    focusTargetIcon: PropTypes.string,
    focusTarget: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        require: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(KEYS))),
        callback: PropTypes.func,
        label: PropTypes.string,
        disabled: PropTypes.bool
    })),
    disabled: PropTypes.bool,
}