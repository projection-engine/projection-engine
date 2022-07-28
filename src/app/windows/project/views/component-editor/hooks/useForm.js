import React, {useContext, useMemo, useState} from "react"
import Transform from "../components/Transform.svelte"
import Lights from "../components/Lights.svelte"
import Mesh from "../components/Mesh.svelte"
import styles from "../styles/Scene.module.css"
import Probe from "../components/Probe.svelte"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import Camera from "../components/Camera.svelte"
import MaterialInstance from "../../../engine/instances/MaterialInstance"
import Scripts from "../components/Scripts.svelte"
import Rendering from "../components/Rendering.svelte"
import PostProcessing from "../components/PostProcessing.svelte"
import Line from "../components/Line.svelte"
import {ENTITY_TAB} from "../components/FormTabs.svelte"
import {Icon} from "@f-ui/core"
import FALLBACK_MATERIAL from "../../../static/misc/FALLBACK_MATERIAL"
import SettingsProvider from "../../../context/SettingsProvider"

export function  updateTransform(axis, data, key, entity) {
    const component = entity.components[COMPONENTS.TRANSFORM]
    const prev = component[key]
    component[key] = [
        axis === "x" ? data : prev[0],
        axis === "y" ? data : prev[1],
        axis === "z" ? data : prev[2]
    ]

    if (entity.components[COMPONENTS.POINT_LIGHT])
        entity.components[COMPONENTS.POINT_LIGHT].changed = true
    if (entity.components[COMPONENTS.PROBE])
        alert.pushAlert("Reflection captures need to be rebuilt",  "alert")
}
export default function useForm(
    engine,
    currentTab
) {
    const settings = useContext(SettingsProvider)
    const [currentKey, setCurrentKey] = useState()
    const submit = (component, key, data) => {
        engine.selectedEntity.components[component][key] = data
    }
    const getField = (key) => {
        if (engine.selectedEntity.components[key])
            switch (key) {
            case COMPONENTS.LINE: {
                return (
                    <Line
                        selected={engine.selectedEntity.components[COMPONENTS.LINE]}
                        submit={(key, value) => engine.selectedEntity.components[COMPONENTS.LINE][key] = value}
                    />
                )
            }
            case COMPONENTS.CAMERA: {
                return (
                    <Camera
                        selected={engine.selectedEntity.components[COMPONENTS.CAMERA]}
                        submit={(key, value) => engine.selectedEntity.components[COMPONENTS.CAMERA][key] = value}
                    />
                )
            }
            case COMPONENTS.TRANSFORM: {
                return (
                    <Transform
                        entityID={engine.selectedEntity.id}
                        engine={engine}

                        selected={engine.selectedEntity.components[COMPONENTS.TRANSFORM]}
                        submitRotation={(axis, data) => updateTransform(axis, data, "rotation", engine.selectedEntity,)}
                        submitScaling={(axis, data) => updateTransform(axis, data, "scaling", engine.selectedEntity,)}
                        submitTranslation={(axis, data) => updateTransform(axis, data, "translation", engine.selectedEntity)}
                    />
                )
            }
            case COMPONENTS.MESH: {
                return (
                    <Mesh
                        entityID={engine.selectedEntity.id}
                        engine={engine}
                        selected={engine.selectedEntity.components[COMPONENTS.MESH]}
                        submit={async (val, key) => {
                            if (key)
                                submit(COMPONENTS.MESH, key, val)
                            else {
                                if (val) {
                                    const exists = window.renderer.materials.find(m => m.id === val.id)
                                    if (!exists) {
                                        let newMat
                                        await new Promise(resolve => {
                                            newMat = new MaterialInstance({
                                                id: val.id,
                                                onCompiled:() => resolve(),
                                                settings: val.blob.settings,
                                                vertex: val.blob.vertexShader,
                                                fragment: val.blob.shader,
                                                uniformData: val.blob.uniformData
                                            })
                                        })
                                        engine.setMaterials(prev => {
                                            return [...prev, newMat]
                                        })
                                    }
                                }
                                const component = engine.selectedEntity.components[COMPONENTS.MESH]
                                if (val) {
                                    component.materialID = val.id
                                    component.uniforms = val.blob.uniforms
                                } else
                                    component.materialID = FALLBACK_MATERIAL
                            }
                        }}

                    />
                )
            }
            case COMPONENTS.DIRECTIONAL_LIGHT:
            case COMPONENTS.POINT_LIGHT: {
                return (
                    <Lights
                        entityID={engine.selectedEntity.id}
                        type={key}
                        selected={engine.selectedEntity.components[key]}
                        submit={(data, k) => submit(key, k, data)}
                        submitColor={(data) => submit(key, "color", data)}
                    />
                )
            }

            case COMPONENTS.PROBE: {
                return (
                    <Probe
                        selected={engine.selectedEntity.components[key]}
                        submit={(data, key) => {
                            submit(COMPONENTS.PROBE, key, data)
                            window.renderer.refreshCubemaps()
                            alert.pushAlert( "Reflection captures need to be rebuilt", "alert")
                        }}
                    />
                )
            }
            default:
                return null
            }
        return null
    }


    return useMemo(() => {
        if ((parseInt(currentTab) > -1 || currentTab === ENTITY_TAB) && engine.selectedEntity && !engine.executingAnimation  && !engine.selectedEntity.components[COMPONENTS.FOLDER]) {
            if (!currentKey)
                setCurrentKey(Object.keys(engine.selectedEntity.components)[0])
            const data = getField(Object.keys(engine.selectedEntity.components)[currentTab])

            return {
                open: true,
                content: (
                    <div className={styles.formsWrapper}>
                        {currentTab !== ENTITY_TAB ?
                            data
                            :
                            <Scripts
                                entity={engine.selectedEntity}
                            />
                        }
                    </div>
                ),
                name: engine.selectedEntity.name
            }
        } else if (engine.executingAnimation) {
            if (currentKey)
                setCurrentKey(undefined)
            return {
                open: false,
                content: (
                    <div className={styles.emptyWrapper}>
                        <Icon
                            styles={{fontSize: "140px"}}
                        >
                            play_arrow
                        </Icon>
                        Stop the simulation to change attributes.
                    </div>
                )
            }
        } else
            return {
                open: false,
                content: (
                    <div className={styles.formsWrapper}>
                        {currentTab === "-2" ? <Rendering/> : null}
                        {currentTab === "-3" ? <PostProcessing selected={settings}/> : null}
                    </div>
                )
            }

    }, [
        engine.selectedEntity,
        currentKey,
        engine.executingAnimation,
        currentTab
    ])
}