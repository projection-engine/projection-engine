import React from "react"
import styles from "../styles/Card.module.css"
export default function Headers(){
    return (
        <div className={styles.headers}>
            <div className={styles.header}>
				Project
            </div>
            <div className={styles.dividerHeaders}/>
            <div className={styles.header}>
				Last modified
            </div>
            <div className={styles.dividerHeaders}/>
            <div className={styles.header}>
				Creation
            </div>
            <div className={styles.dividerHeaders}/>
            <div className={styles.header}/>
        </div>
    )
}