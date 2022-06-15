import styles from "../styles/ViewportOptions.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"

import PropTypes from "prop-types"
import SHADING_MODELS from "../../../engine/templates/SHADING_MODELS"
import React, {useMemo} from "react"

export default function Shading(props) {
    const {settingsContext} = props
    const icon = "check"
    const meshIcon = "view_in_ar"
    const settingsIcon = "settings"

    const shading = useMemo(() => {
        switch (settingsContext.shadingModel) {
        case SHADING_MODELS.LIGHT_ONLY:
            return {
                icon: "light_bulb",
                label: "Light only"
            }
        case SHADING_MODELS.ALBEDO:
            return {label: "Unlit", icon: <div style={{"--colorToApply": "white"}} className={styles.flatIcon}/>}
        case SHADING_MODELS.NORMAL:
            return {
                icon: meshIcon,
                label: "Normal"
            }
        case SHADING_MODELS.TANGENT:
            return {
                icon: meshIcon,
                label: "Tangent"
            }
        case SHADING_MODELS.DEPTH:
            return {
                icon: settingsIcon,
                label: "Depth"
            }
        case SHADING_MODELS.AO:
            return {
                icon: settingsIcon,
                label: "AO"
            }
        case SHADING_MODELS.BI_TANGENT:
            return {
                icon: meshIcon,
                label: "Bi-Tangent"
            }
        case SHADING_MODELS.TEX_COORD:
            return {
                icon: meshIcon,
                label: "Texture coords"
            }
        case SHADING_MODELS.DETAIL:
            return {
                label: "Details",
                icon: <div style={{"--colorToApply": "white"}} className={styles.shadedIcon}/>
            }
        default:
            return {}
        }
    }, [settingsContext.shadingModel])
    return (
        <Dropdown className={styles.dropdown}>
            <Icon styles={{fontSize: "1.1rem", maxWidth: "1.1rem"}}>
                {shading.icon}
            </Icon>
            <div style={{whiteSpace: "nowrap"}}>{shading.label}</div>
            <DropdownOptions>
                <DropdownOption
                    option={{
                        label: "Light only",
                        icon: settingsContext.shadingModel === SHADING_MODELS.LIGHT_ONLY ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.LIGHT_ONLY
                    }}/>
                <DropdownOption
                    option={{
                        label: "Unlit",
                        icon: settingsContext.shadingModel === SHADING_MODELS.ALBEDO ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.ALBEDO
                    }}/>
                <DropdownOption
                    option={{
                        label: "Details",
                        icon: settingsContext.shadingModel === SHADING_MODELS.DETAIL ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.DETAIL
                    }}/>
                <label className={styles.label}>Rendering</label>
                <DropdownOption
                    option={{
                        label: "Ambient occlusion",
                        icon: settingsContext.shadingModel === SHADING_MODELS.AO ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.AO
                    }}/>
                <DropdownOption
                    option={{
                        label: "Depth",
                        icon: settingsContext.shadingModel === SHADING_MODELS.DEPTH ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.DEPTH
                    }}/>

                <label className={styles.label}>Mesh</label>
                <DropdownOption
                    option={{
                        label: "Normal",
                        icon: settingsContext.shadingModel === SHADING_MODELS.NORMAL ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.NORMAL
                    }}/>
                <DropdownOption
                    option={{
                        label: "Tangent",
                        icon: settingsContext.shadingModel === SHADING_MODELS.TANGENT ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.TANGENT
                    }}/>
                <DropdownOption
                    option={{
                        label: "Bi-Tangent",
                        icon: settingsContext.shadingModel === SHADING_MODELS.BI_TANGENT ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.BI_TANGENT
                    }}/>
                <DropdownOption
                    option={{
                        label: "Texture coords",
                        icon: settingsContext.shadingModel === SHADING_MODELS.TEX_COORD ? icon : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.TEX_COORD
                    }}/>
            </DropdownOptions>
        </Dropdown>

    )
}

Shading.propTypes = {
    settingsContext: PropTypes.object
}