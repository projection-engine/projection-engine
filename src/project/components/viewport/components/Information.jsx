import styles from "../styles/Information.module.css"
import INFORMATION_CONTAINER from "../../../static/misc/INFORMATION_CONTAINER"
import React, {useEffect} from "react"

export default function Information() {
    useEffect(() => {
        const performanceSystem = window.renderer.miscellaneousPass.metrics
        performanceSystem.renderTarget = document.getElementById(INFORMATION_CONTAINER.FPS)
    }, [])

    return (
        <div id={INFORMATION_CONTAINER.CONTAINER} className={styles.container}>
            <div id={INFORMATION_CONTAINER.FPS}/>
            <div id={INFORMATION_CONTAINER.TRANSFORMATION}/>
        </div>
    )
}