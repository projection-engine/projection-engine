import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import KEYS from "../../../engine/templates/KEYS";


export default function useHotKeys(props, listeners=[]) {
    let clicked = {}
    const [focused, setFocused] = useState(false)
    const handleKey = (e) => {
        if (focused && document.activeElement === document.body) {
            if (e.type === 'keydown') {
                clicked[e.code] = true

                props.actions.forEach(a => {

                    let trigger = true, c = 0
                    a.require.forEach(r => {
                        trigger = trigger && clicked[r]
                        c++
                    })


                    if (trigger && c === Object.keys(clicked).length && !document.pointerLockElement)
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
}, [props.actions, props.disabled, props.focusTarget, focused, listeners])
}
useHotKeys.propTypes = {
    focusTarget: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        require: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(KEYS))),
        callback: PropTypes.func
    })),
    disabled: PropTypes.bool,
}