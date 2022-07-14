import React, {useEffect, useRef, useState} from "react"
import styles from "../styles/HeaderOptions.module.css"
import Shading from "../components/Shading"
import Add from "../components/Add"
import Visible from "../components/Visible"
import {Button, Icon} from "@f-ui/core"


export default function HeaderOptions() {
    const [fullscreen, setFullscreen] = useState(false)

    const handleFullscreen = () => {
        if (!document.fullscreenElement)
            setFullscreen(false)
        else
            setFullscreen(true)
    }
    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreen)
        return () => document.removeEventListener("fullscreenchange", handleFullscreen)
    }, [fullscreen])


    const ref = useRef()

    const onClickFullscreen = () => {
        if (!fullscreen) {
            ref.current.parentNode.requestFullscreen()
                .then(() => setFullscreen(true))
                .catch()
        } else
            document.exitFullscreen()
                .catch()
                .finally(() => setFullscreen(false))
    }
    if(fullscreen)
        return null
    return (
        <div className={styles.options} ref={ref} style={{display: fullscreen ? "none" : undefined}} draggable={false}>
            <div style={{justifyContent: "flex-start"}} className={styles.align}>
                <Button className={styles.dropdown} onClick={onClickFullscreen}>
                    <Icon styles={{fontSize: "1.1rem"}}>fullscreen</Icon>
                </Button>
                <Visible />
                <Add/>
            </div>
            <Shading/>
        </div>
    )
}