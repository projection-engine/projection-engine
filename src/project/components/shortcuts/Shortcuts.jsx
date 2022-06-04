import React, {useContext} from "react"
import HotKeysProvider from "../../../components/hot-keys/HotKeysProvider"
import styles from "./styles/Shortcuts.module.css"
import KEYS from "./KEYS"

export default function Shortcuts(){
    const { allShortcuts, activeWindow } = useContext(HotKeysProvider)
    return (
        <div className={styles.wrapper}>
            <div className={[styles.item, styles.itemWrapper].join(" ")}>
                <span style={{fontSize: "1rem"}} className={"material-icons-round"}>{activeWindow?.icon}</span>
                <label>{activeWindow?.label}</label>
            </div>
            
            {allShortcuts.map((a, i) => (
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