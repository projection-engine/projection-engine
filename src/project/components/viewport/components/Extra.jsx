import styles from "../styles/ViewportOptions.module.css"
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core"
import PropTypes from "prop-types"
import React, {useState} from "react"
import LabeledRange from "../../../../components/templates/LabeledRange"

const toDegree= 180 / 3.1415
const toRad= 3.1415 /180
export default function Extra(props) {
    const {settingsContext, fullscreen, setFullscreen, fullscreenID} = props
    const [fov, setFov] = useState(settingsContext.fov * toDegree)
    return (
        <Dropdown
            hideArrow={true}
            className={styles.optionWrapper}>
            <span style={{fontSize: "1.1rem"}} className={"material-icons-round"}>more_vert</span>
            <DropdownOptions>
                <DropdownOption option={{
                    label: "Fullscreen",
                    shortcut: "Ctrl + shift + f",
                    onClick: () => {
                        const el = document.getElementById(fullscreenID)
                        if (el) {
                            if (!fullscreen) {
                                el.requestFullscreen()
                                    .then(() => {
                                        setFullscreen(true)
                                    })
                            } else {
                                document.exitFullscreen()
                                    .then(() => setFullscreen(false))

                            }
                        }
                    }
                }}/>
                <DropdownOption option={{
                    label: "Show FPS",
                    icon: settingsContext.performanceMetrics ? <span style={{fontSize: "1.2rem"}}
                        className={"material-icons-round"}>check</span> : undefined,
                    onClick: () => settingsContext.performanceMetrics = !settingsContext.performanceMetrics,
                    shortcut: "Ctrl + shift + h"
                }}/>
                <div className={styles.divider}/>
                <div className={styles.rangeWrapper}>
                    <LabeledRange
                        label={"FOV"}
                        accentColor={"green"}
                        value={fov} maxValue={120} minValue={45}
                        onFinish={() => {
                            settingsContext.fov = fov * toRad
                        }}
                        handleChange={e => {
                            setFov(e)
                        }}
                    />
                </div>
            </DropdownOptions>
        </Dropdown>
    )
}

Extra.propTypes = {
    fullscreenID: PropTypes.string,
    settingsContext: PropTypes.object,
    fullscreen: PropTypes.bool, setFullscreen: PropTypes.func
}