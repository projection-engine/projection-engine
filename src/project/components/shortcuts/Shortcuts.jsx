import React, {useEffect} from "react"

import styles from "./styles/Shortcuts.module.css"
import SHORTCUTS_ID from "../../../static/misc/SHORTCUTS_ID"
import KEYS from "../../engine/templates/KEYS"

export default function Shortcuts() {
    function handler(event) {
        if (document.activeElement?.tagName !== "INPUT") {
            const l = window.shortcuts.all.length
            if (event.type === "keydown") {
                if (event.ctrlKey) {
                    window.shortcuts.active[KEYS.ControlLeft] = true
                    window.shortcuts.active[KEYS.ControlRight] = true
                }

                window.shortcuts.active[event.code] = true
                for (let i = 0; i < l; i++) {
                    const a = window.shortcuts.all[i]
                    let trigger = true
                    a.require.forEach(r => {
                        trigger = trigger && window.shortcuts.active[r]
                    })

                    if (trigger && !a.disabled && a.callback !== undefined)
                        a.callback()
                }
            } else {
                if (event.code === KEYS.ControlLeft || event.code === KEYS.ControlRight) {
                    delete window.shortcuts.active[KEYS.ControlLeft]
                    delete window.shortcuts.active[KEYS.ControlRight]
                } else
                    delete window.shortcuts.active[event.code]
            }
            window.shortcuts.updateShortcuts()
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handler)
        document.addEventListener("keyup", handler)
        return () => {
            document.removeEventListener("keyup", handler)
            document.removeEventListener("keydown", handler)
        }
    }, [])
    return <div className={styles.wrapper} id={SHORTCUTS_ID}/>
}