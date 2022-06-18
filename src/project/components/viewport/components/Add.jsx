import styles from "../styles/ViewportOptions.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import Entity from "../../../engine/basic/Entity"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import PointLightComponent from "../../../engine/components/PointLightComponent"
import TransformComponent from "../../../engine/components/TransformComponent"
import React from "react"
import DirectionalLightComponent from "../../../engine/components/DirectionalLightComponent"
import CameraComponent from "../../../engine/components/CameraComponent"
import CubeMapComponent from "../../../engine/components/CubeMapComponent"
import CubeMapInstance from "../../../engine/instances/CubeMapInstance"
import PropTypes from "prop-types"
import LineComponent from "../../../engine/components/LineComponent"
import LightProbeComponent from "../../../engine/components/LightProbeComponent"

export default function Add(props) {
    const {dispatchEntity, engine} = props
    return (
        <Dropdown className={styles.dropdown}>
            Add
            <DropdownOptions>
                <div className={styles.dividerWrapper}>
                    Lights
                    <div className={styles.divider}/>
                </div>
                <DropdownOption option={{
                    label: "Point light",
                    icon: <Icon
                        styles={{fontSize: "1.2rem"}}>lightbulb</Icon>,
                    onClick: () => {
                        const actor = new Entity(undefined, "Point light")
                        actor.components[COMPONENTS.POINT_LIGHT] = new PointLightComponent()
                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].translation = engine.cursor.components[COMPONENTS.TRANSFORM].translation
                        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{
                    disabled: true,
                    label: "Spot light",
                    icon: <Icon
                        styles={{fontSize: "1.2rem"}}>flashlight_on</Icon>,
                    onClick: () => {
                        const actor = new Entity(undefined, "Point light")
                        actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new PointLightComponent()
                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{

                    label: "Directional light",
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>light_mode</Icon>,
                    onClick: () => {

                        const actor = new Entity(undefined, "Directional light")
                        actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new DirectionalLightComponent()
                        dispatchEntity(actor)
                    }
                }}/>
                <div className={styles.dividerWrapper}>
                    Ambient
                    <div className={styles.divider}/>
                </div>
                <DropdownOption option={{
                    label: "CubeMap",
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>panorama_photosphere</Icon>,
                    onClick: () => {

                        const actor = new Entity(undefined, "Cubemap")
                        actor.components[COMPONENTS.CUBE_MAP] = new CubeMapComponent()
                        actor.components[COMPONENTS.CUBE_MAP].cubeMap = new CubeMapInstance(engine.gpu, actor.components[COMPONENTS.CUBE_MAP].resolution)
                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].translation = engine.cursor.components[COMPONENTS.TRANSFORM].translation
                        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{
                    label: "Light probe",
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>lens_blur</Icon>,
                    onClick: () => {
                        const actor = new Entity(undefined, "Light probe")
                        actor.components[COMPONENTS.PROBE] = new LightProbeComponent()
                        actor.components[COMPONENTS.PROBE].addProbe([-1, 1, -1])
                        actor.components[COMPONENTS.PROBE].addProbe([-1, -1, -1])
                        actor.components[COMPONENTS.PROBE].addProbe([1, 1, 1])
                        actor.components[COMPONENTS.PROBE].addProbe([1, -1, 1])

                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].translation = engine.cursor.components[COMPONENTS.TRANSFORM].translation
                        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

                        dispatchEntity(actor)
                    }
                }}/>

                <div className={styles.dividerWrapper}>
                    Utils
                    <div className={styles.divider}/>
                </div>
                <DropdownOption option={{
                    label: "Camera",
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>videocam</Icon>,
                    onClick: () => {
                        const actor = new Entity(undefined, "Camera")
                        actor.components[COMPONENTS.CAMERA] = new CameraComponent()

                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].translation = engine.cursor.components[COMPONENTS.TRANSFORM].translation
                        actor.components[COMPONENTS.TRANSFORM].rotation = [0, 0, 0]
                        actor.components[COMPONENTS.TRANSFORM].scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true


                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{
                    label: "Line",
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>arrow_right_alt</Icon>,
                    onClick: () => {
                        const actor = new Entity(undefined, "Line")
                        actor.components[COMPONENTS.LINE] = new LineComponent()

                        dispatchEntity(actor)
                    }
                }}/>
            </DropdownOptions>
        </Dropdown>
    )
}

Add.propTypes = {
    dispatchEntity: PropTypes.func,
    engine: PropTypes.object
}