import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"

import styles from "../styles/HeaderOptions.module.css"
import React, {useContext, useState} from "react"
import Range from "../../../../components/range/Range"
import SettingsProvider from "../../../context/SettingsProvider"

export default function Visible() {
    const settingsContext = useContext(SettingsProvider)
    const [iconSize, setIconSize] = useState(settingsContext.iconSize)
    const checkIcon = <Icon style={{fontSize: "1.2rem"}}>check</Icon>
    return (
        <Dropdown
            className={styles.dropdown}
        >
            <div className={styles.summary}>
                <Icon styles={{fontSize: "1.1rem"}}>visibility</Icon>
                <div className={styles.overflow}>
                    View
                </div>
            </div>
            <DropdownOptions>
                <DropdownOption option={{
                    label: "Grid",
                    keepAlive: true,
                    icon: settingsContext.gridVisibility ? checkIcon : undefined,
                    onClick: () => settingsContext.gridVisibility = !settingsContext.gridVisibility,
                }}/>
                <DropdownOption option={{
                    label: "Icons",
                    keepAlive: true,
                    icon: settingsContext.iconsVisibility ? checkIcon : undefined,
                    onClick: () => settingsContext.iconsVisibility = !settingsContext.iconsVisibility
                }}/>
                <DropdownOption option={{
                    label: "Show FPS",
                    icon: settingsContext.performanceMetrics ? checkIcon : undefined,
                    onClick: () => settingsContext.performanceMetrics = !settingsContext.performanceMetrics,
                    shortcut: "Ctrl + shift + h"
                }}/>
                <DropdownOption option={{
                    label: "Camera animation",
                    icon: settingsContext.cameraAnimation ? checkIcon : undefined,
                    onClick: () => {
                        const v = !settingsContext.cameraAnimation
                        settingsContext.cameraAnimation = v
                        window.renderer.camera.animated = v
                    }
                }}/>

                <div className={styles.rangeWrapper}>
                    <Range
                        label={"Icon size"}
                        accentColor={"red"}
                        value={iconSize}
                        maxValue={5} minValue={.1}
                        onFinish={() => settingsContext.iconSize = iconSize}
                        handleChange={e => {
                            setIconSize(e)
                        }}
                    />
                </div>
            </DropdownOptions>
        </Dropdown>
    )
}