import {useContext, useEffect, useRef} from "react"
import PropTypes from "prop-types"
import KEYS from "../../engine/templates/KEYS"
import HotKeysProvider from "./HotKeysProvider"

export default function useHotKeys(props, listeners = []) {
    let clicked = {}, target = typeof props.focusTarget === "string" ? document.getElementById(props.focusTarget) : props.focusTarget
    const { setAllShortcuts, setActiveWindow, activeWindow, setActiveKeys } = useContext(HotKeysProvider)
    const focused = useRef(false)

    function handler(e){
        if(e.type === "mouseenter" || e.type === "mouseleave") {
            focused.current = e.type === "mouseenter"
            if(focused.current  && activeWindow?.reference !== target) {
                setActiveWindow({
                    reference: target,
                    label: props.focusTargetLabel,
                    icon: props.focusTargetIcon
                })
            }
            clicked = {}
        }
        else if ((focused.current  || activeWindow?.reference === target) && document.activeElement === document.body) {
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

            setActiveKeys(clicked)
        }
    }

    useEffect(() => {
        if (!props.disabled && target) {
            if(focused.current)
                setAllShortcuts(props.actions)
            target.addEventListener("mouseenter", handler)
            target.addEventListener("mouseleave", handler)
            document.addEventListener("keydown", handler)
            document.addEventListener("keyup", handler)
        }
        return () => {
            target?.removeEventListener("mouseenter", handler)
            target?.removeEventListener("mouseleave", handler)
            document.removeEventListener("keyup", handler)
            document.removeEventListener("keydown", handler)
        }
    }, [props.actions, props.disabled, listeners])
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