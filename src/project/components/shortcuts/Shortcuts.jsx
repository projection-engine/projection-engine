import React, {useContext, useMemo} from "react"
import HotKeysProvider from "../../hooks/hot-keys/HotKeysProvider"
import styles from "./styles/Shortcuts.module.css"
import KEYS from "../../../static/misc/LABELED_KEYS"

export default function Shortcuts(){
    const { allShortcuts, activeWindow, activeKeys } = useContext(HotKeysProvider)

    const actions = useMemo(() => {
        const clickedLen = Object.keys(activeKeys).length
        return allShortcuts.filter(a => (a.require.length === 1 && clickedLen === 0 )|| a.require.find(e => activeKeys[e] === true) !== undefined)
    }, [activeKeys, allShortcuts])

    return (
        <div className={styles.wrapper}>
            {activeWindow ? <div className={[styles.item, styles.itemWrapper].join(" ")}>
                <span style={{fontSize: "1rem"}} className={"material-icons-round"}>{activeWindow?.icon}</span>
                <label>{activeWindow?.label}</label>
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