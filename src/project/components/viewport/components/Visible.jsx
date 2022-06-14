import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"

import styles from "../styles/ViewportOptions.module.css"
import PropTypes from "prop-types"
import React, {useState} from "react"
import LabeledRange from "../../../../components/templates/LabeledRange"

export default function Visible(props) {
    const {settingsContext} = props
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
                <div className={styles.rangeWrapper}>
                    <LabeledRange
                        label={"Icon size"}
                        accentColor={"red"}
                        value={iconSize}
                        maxValue={5} minValue={.1}
                        onFinish={() => {
                            settingsContext.iconSize = iconSize
                        }}
                        handleChange={e => {
                            setIconSize(e)
                        }}
                    />
                </div>
            </DropdownOptions>
        </Dropdown>
    )
}

Visible.propTypes={
    settingsContext: PropTypes.object
}