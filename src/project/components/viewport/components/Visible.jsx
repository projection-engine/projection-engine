import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"

import styles from "../styles/HeaderOptions.module.css"
import React, {useContext} from "react"
import Range from "../../../../components/range/Range"
import SettingsProvider from "../../../context/SettingsProvider"
import useLocalization from "../../../../global/useLocalization"

export default function Visible() {
    const settingsContext = useContext(SettingsProvider)
    const checkIcon = <Icon style={{fontSize: "1.2rem"}}>check</Icon>
    const translate = useLocalization("PROJECT", "VIEWPORT")
    return (
        <Dropdown
            className={styles.dropdown}
        >
            <div className={styles.summary}>
                <Icon styles={{fontSize: "1.1rem"}}>visibility</Icon>
                <div className={styles.overflow}>
                    {translate("VISIBLE")}
                </div>
            </div>
            <DropdownOptions>
                <DropdownOption option={{
                    label: translate("GRID"),
                    keepAlive: true,
                    icon: settingsContext.gridVisibility ? checkIcon : undefined,
                    onClick: () => settingsContext.gridVisibility = !settingsContext.gridVisibility,
                }}/>
                <DropdownOption option={{
                    label: translate("ICONS"),
                    keepAlive: true,
                    icon: settingsContext.iconsVisibility ? checkIcon : undefined,
                    onClick: () => settingsContext.iconsVisibility = !settingsContext.iconsVisibility
                }}/>

                <DropdownOption option={{
                    label: translate("CAM_ANIM"),
                    icon: settingsContext.cameraAnimation ? checkIcon : undefined,
                    onClick: () => {
                        const v = !settingsContext.cameraAnimation
                        settingsContext.cameraAnimation = v
                        window.renderer.camera.animated = v
                    }
                }}/>
                <DropdownOption option={{
                    label: translate("BACKGROUND"),
                    icon: settingsContext.background ? checkIcon : undefined,
                    onClick: () => {
                        settingsContext.background = !settingsContext.background
                    }
                }}/>

                <div className={styles.rangeWrapper}>
                    <Range
                        label={translate("ICON_SIZE")}
                        value={settingsContext.iconSize}
                        maxValue={5} minValue={.1}
                        onFinish={v => settingsContext.iconSize = v}
                    />
                </div>
            </DropdownOptions>
        </Dropdown>
    )
}