import React from "react"
import styles from "../styles/Card.module.css"
import useLocalization from "../../global/useLocalization"

export default function Headers(){
    const translate = useLocalization("HOME", "HEADERS")
    return (
        <div className={styles.headers}>
            <div className={styles.header}>
                {translate("PROJECT")}
            </div>
            <div className={styles.dividerHeaders}/>
            <div className={styles.header}>
                {translate("LAST_MODIFIED")}
            </div>
            <div className={styles.dividerHeaders}/>
            <div className={styles.header}>
                {translate("CREATION")}
            </div>
            <div className={styles.dividerHeaders}/>
            <div className={styles.header}/>
        </div>
    )
}