import React, {useContext, useMemo} from "react"

import styles from "./styles/Shortcuts.module.css"
import KEYS from "../../../static/misc/LABELED_KEYS"
import HotKeysProvider from "./hooks/HotKeysProvider"
import {Icon} from "@f-ui/core"

export default function Shortcuts(){
    const shortcuts = useContext(HotKeysProvider)
    const actions = useMemo(() => {
        const clickedLen = Object.keys(shortcuts.active).length
        return shortcuts.all.filter(a => (a.require.length === 1 && clickedLen === 0 )|| a.require.find(e => shortcuts.active[e] === true) !== undefined)
    }, [shortcuts])

    return (
        <div className={styles.wrapper}>
            {shortcuts.window ? <div className={[styles.item, styles.itemWrapper].join(" ")}>
                <Icon styles={{fontSize: "1rem"}}>{shortcuts.window.icon}</Icon>
                <label>{shortcuts.window.label}</label>
            </div> :
                <div className={styles.item}>
                    Nothing focused
                </div>}
            
            {actions.map((a, i) => (
                <div className={styles.itemWrapper} key={"short-cut-" + a.label + "-" + i}  style={{display: a.disabled ? "none" : undefined}}>
                    <div className={styles.item}>
                        {a.require.map((e, i) => KEYS[e] + (i < a.require.length -1? " + " : ""))}
                    </div>
                    <div>
                        {a.label}
                    </div>
                </div>
            ))}
        </div>
    )
}