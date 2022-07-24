import styles from "../styles/Information.module.css"
import INFORMATION_CONTAINER from "../../../static/misc/INFORMATION_CONTAINER"
import React, {useEffect} from "react"
import PropTypes from "prop-types"

export default function Information(props) {
    useEffect(() => {
        const performanceSystem = window.renderer.miscellaneousPass.metrics
        performanceSystem.renderTarget = document.getElementById(INFORMATION_CONTAINER.FPS)
    }, [])

    return (
        <div id={INFORMATION_CONTAINER.CONTAINER} className={styles.container} style={{display: props.visible ? undefined : "none"}}>
            <div id={INFORMATION_CONTAINER.FPS}/>
            <div id={INFORMATION_CONTAINER.TRANSFORMATION}/>
        </div>
    )
}

Information.propTypes={
    visible: PropTypes.bool
}