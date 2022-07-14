import styles from "../styles/HeaderOptions.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import SHADING_MODELS from "../../../../static/misc/SHADING_MODELS"
import React, {useContext, useEffect, useMemo, useState} from "react"
import SettingsProvider from "../../../context/SettingsProvider"

export default function Shading() {
    const [shadingModel, setShadingModel] = useState(SHADING_MODELS.DETAIL)
    const icon = <Icon styles={{fontSize: "1rem", maxWidth: "1.1rem"}}>check</Icon>
    const meshIcon =  <Icon styles={{fontSize: "1rem", maxWidth: "1.1rem"}}>view_in_ar</Icon>
    const settingsIcon =  <Icon styles={{fontSize: "1rem", maxWidth: "1.1rem"}}>settings</Icon>
    const settings= useContext(SettingsProvider)
    const shading = useMemo(() => {
        switch (shadingModel) {
        case SHADING_MODELS.LIGHT_ONLY:
            return {
                icon: <Icon styles={{fontSize: "1rem", maxWidth: "1.1rem"}}>light_bulb</Icon>,
                label: "Light only"
            }
        case SHADING_MODELS.ALBEDO:
            return {label: "Unlit", icon: <div style={{"--colorToApply": "white"}} className={styles.flatIcon}/>}
        case SHADING_MODELS.NORMAL:
            return {
                icon: meshIcon,
                label: "Normal"
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

        case SHADING_MODELS.DETAIL:
            return {
                label: "Details",
                icon: <div style={{"--colorToApply": "white"}} className={styles.shadedIcon}/>
            }
        default:
            return {}
        }
    }, [shadingModel])

    const getTexture = () => {
        switch (shadingModel){
        case SHADING_MODELS.DEPTH:
            return window.renderer.renderingPass.depthPrePass.depth
        case SHADING_MODELS.AO:
            return window.renderer.renderingPass.ao.texture
        case SHADING_MODELS.NORMAL:
            return window.renderer.renderingPass.deferred.frameBuffer.colors[1]
        case SHADING_MODELS.ALBEDO:
            return window.renderer.renderingPass.deferred.frameBuffer.colors[2]
        }

    }
    useEffect(() => {
        if(window.renderer) {
            if (shadingModel !== SHADING_MODELS.DETAIL)
                window.renderer.postProcessingPass.finalPass.workerTexture = getTexture()
            else
                window.renderer.postProcessingPass.finalPass.workerTexture = window.renderer.renderingPass.currentFrameFBO.colors[0]
        }
    }, [shadingModel])

    useEffect(() => {
        if(!settings.ao && shadingModel === SHADING_MODELS.AO) {
            setShadingModel(SHADING_MODELS.DETAIL)
            alert.pushAlert("Switching to details shading model", "info")
        }

    }, [settings.ao])
    return (
        <Dropdown className={styles.dropdown}>
            {shading.icon}
            <div style={{whiteSpace: "nowrap"}}>{shading.label}</div>
            <DropdownOptions>
                <DropdownOption
                    option={{
                        label: "Details",
                        icon: shadingModel === SHADING_MODELS.DETAIL ? icon : undefined,
                        onClick: () => setShadingModel(SHADING_MODELS.DETAIL)
                    }}
                />
                <DropdownOption
                    option={{
                        label: "Light only",
                        icon: shadingModel === SHADING_MODELS.LIGHT_ONLY ? icon : undefined,
                        onClick: () => setShadingModel(SHADING_MODELS.LIGHT_ONLY),
                        disabled: true
                    }}
                />
                <DropdownOption
                    option={{
                        label: "Unlit",
                        icon: shadingModel === SHADING_MODELS.ALBEDO ? icon : undefined,
                        onClick: () => setShadingModel(SHADING_MODELS.ALBEDO)
                    }}
                />

                <label className={styles.label}>Rendering</label>
                <DropdownOption
                    option={{
                        disabled: !settings.ao,
                        label: "Ambient occlusion",
                        icon: shadingModel === SHADING_MODELS.AO ? icon : undefined,
                        onClick: () => setShadingModel(SHADING_MODELS.AO)
                    }}
                />
                <DropdownOption
                    option={{
                        label: "Depth",
                        icon: shadingModel === SHADING_MODELS.DEPTH ? icon : undefined,
                        onClick: () => setShadingModel(SHADING_MODELS.DEPTH)
                    }}
                />
                <label className={styles.label}>Mesh</label>
                <DropdownOption
                    option={{
                        label: "Normal",
                        icon: shadingModel === SHADING_MODELS.NORMAL ? icon : undefined,
                        onClick: () => setShadingModel( SHADING_MODELS.NORMAL)
                    }}
                />
            </DropdownOptions>
        </Dropdown>

    )
}
