import styles from "../styles/HeaderOptions.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import Entity from "../../../engine/basic/Entity"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import PointLightComponent from "../../../engine/components/PointLightComponent"
import TransformComponent from "../../../engine/components/TransformComponent"
import React, {useContext} from "react"
import DirectionalLightComponent from "../../../engine/components/DirectionalLightComponent"
import CameraComponent from "../../../engine/components/CameraComponent"
import ProbeComponent from "../../../engine/components/ProbeComponent"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import EngineProvider from "../../../context/EngineProvider"
import useLocalization from "../../../../global/useLocalization"

export default function Add() {
    const [engine] = useContext(EngineProvider)
    const createCM = (asDiffuse) => {
        const actor = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        actor.components[COMPONENTS.PROBE] = new ProbeComponent()
        actor.components[COMPONENTS.PROBE].specularProbe = !asDiffuse
        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
        actor.components[COMPONENTS.TRANSFORM].translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
    }
    const translate = useLocalization("PROJECT", "VIEWPORT")

    return (
        <Dropdown className={styles.dropdown}>
            Add
            <DropdownOptions>
                <div className={styles.dividerWrapper}>
                    {translate("LIGHTS")}
                    <div className={styles.divider}/>
                </div>
                <DropdownOption option={{
                    label: translate("POINT_LIGHT"),
                    icon: <Icon
                        styles={{fontSize: "1.2rem"}}>lightbulb</Icon>,
                    onClick: () => {
                        const actor = new Entity(undefined, translate("POINT_LIGHT"))
                        actor.components[COMPONENTS.POINT_LIGHT] = new PointLightComponent()
                        const transformComponent = new TransformComponent()
                        transformComponent.translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
                        transformComponent.lockedRotation = true
                        transformComponent.lockedScaling = true
                        actor.components[COMPONENTS.TRANSFORM] = transformComponent
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                }}/>
                {/*<DropdownOption option={{*/}
                {/*    disabled: true,*/}
                {/*    label: "Spot light",*/}
                {/*    icon: <Icon*/}
                {/*        styles={{fontSize: "1.2rem"}}>flashlight_on</Icon>,*/}
                {/*    onClick: () => {*/}
                {/*        const actor = new Entity(undefined, "Point light")*/}
                {/*        actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new PointLightComponent()*/}
                {/*        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})*/}
                {/*    }*/}
                {/*}}/>*/}
                <DropdownOption option={{
                    label: translate("DIRECTIONAL_LIGHT"),
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>light_mode</Icon>,
                    onClick: () => {

                        const actor = new Entity(undefined,  translate("DIRECTIONAL_LIGHT"))

                        const transformComponent = new TransformComponent()
                        transformComponent.translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
                        transformComponent.lockedRotation = true
                        transformComponent.lockedScaling = true
                        actor.components[COMPONENTS.TRANSFORM] = transformComponent
                        actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new DirectionalLightComponent(undefined, actor)


                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                }}/>
                <div className={styles.dividerWrapper}>
                    {translate("AMBIENT")}
                    <div className={styles.divider}/>
                </div>
                <DropdownOption option={{
                    label: translate("SPECULAR_PROBE"),
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>lens_blur</Icon>,
                    onClick: () => createCM()
                }}/>
                <DropdownOption option={{
                    label: translate("DIFFUSE_PROBE"),
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>lens_blur</Icon>,
                    onClick: () =>  createCM(true)
                }}/>

                <div className={styles.dividerWrapper}>
                    {translate("UTILS")}
                    <div className={styles.divider}/>
                </div>
                <DropdownOption option={{
                    label: translate("CAMERA"),
                    icon: <Icon
                        styles={{fontSize: "1.1rem"}}>videocam</Icon>,
                    onClick: () => {
                        const actor = new Entity(undefined, translate("CAMERA"))
                        actor.components[COMPONENTS.CAMERA] = new CameraComponent()

                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
                        actor.components[COMPONENTS.TRANSFORM].rotation = [0, 0, 0]
                        actor.components[COMPONENTS.TRANSFORM].scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true


                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                }}/>
                {/*<DropdownOption option={{*/}
                {/*    label: "Line",*/}
                {/*    icon: <Icon*/}
                {/*        styles={{fontSize: "1.1rem"}}>arrow_right_alt</Icon>,*/}
                {/*    onClick: () => {*/}
                {/*        const actor = new Entity(undefined, "Line")*/}
                {/*        actor.components[COMPONENTS.LINE] = new LineComponent()*/}

                {/*        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})*/}
                {/*    }*/}
                {/*}}/>*/}
            </DropdownOptions>
        </Dropdown>
    )
}
