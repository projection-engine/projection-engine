import styles from "../styles/SideBar.module.css"
import React, {useState} from "react"
import CameraOptions from "./CameraOptions"
import PropTypes from "prop-types"

export default function SideBar(props){
    const [open, setOpen] = useState()
    return (
        <div className={styles.wrapper}>
            <CameraOptions
                engine={props.engine}
            />

            {/*<div className={styles.bar}>*/}

            {/*</div>*/}
        </div>
    )
}
SideBar.propTypes={
    engine: PropTypes.object
}