import {useEffect, useRef} from "react"

export default function useHotKeys({
    focusTargetLabel,
    focusTargetIcon,
    focusTarget,
    actions,
    disabled
}) {
    const initialized = useRef(false)

    function handler(e) {
        e.currentTarget.focus()
        window.shortcuts.window = {
            label: focusTargetLabel,
            icon: focusTargetIcon
        }
        window.shortcuts.all = actions
        window.shortcuts.updateShortcuts()
        window.shortcuts.active = {}
    }

    useEffect(() => {
        const target = typeof focusTarget === "object" ? focusTarget : document.getElementById(focusTarget)
        if (!disabled && target) {
            if (document.activeElement === target) {
                window.shortcuts.all = actions
                window.shortcuts.updateShortcuts()
            }
            target.tabIndex = 0
            if (!initialized.current) {
                initialized.current = true
                target.focus()
            }
            target.addEventListener("mouseenter", handler)
        }
        return () => {
            target.removeEventListener("mouseenter", handler)
        }
    }, [actions, disabled])
}

