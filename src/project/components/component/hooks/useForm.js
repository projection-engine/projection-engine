import React, {useMemo, useState} from "react"
import Transform from "../components/Transform"
import Lights from "../components/Lights"
import Material from "../components/Material"
import Mesh from "../components/Mesh"
import styles from "../styles/Scene.module.css"
import Probe from "../components/Probe"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import cloneClass from "../../../engine/utils/cloneClass"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import Camera from "../components/Camera"
import MaterialInstance from "../../../engine/instances/MaterialInstance"
import Scripts from "../components/Scripts"
import Rendering from "../components/Rendering"
import Editor from "../components/Editor"
import Line from "../components/Line"
import {ENTITY_TAB} from "../components/FormTabs"
import {Icon} from "@f-ui/core"
import FALLBACK_MATERIAL from "../../../../static/misc/FALLBACK_MATERIAL"

export function  updateTransform(axis, data, key, engine, entityID) {
    const entity = engine.entities.find(e => e.id === entityID)
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
    engine.dispatchEntities({
        type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
            entityID,
            key: COMPONENTS.TRANSFORM,
            data: component
        }
    })
}
export default function useForm(
    engine,
    quickAccess,
    currentTab
) {
    const [currentKey, setCurrentKey] = useState()
    const selected = engine.selectedEntity

    const submit = (component, key, data) => {
        const clone = cloneClass(selected.components[component])
        clone[key] = data
        engine.dispatchEntities({
            type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                entityID: engine.selected[0],
                data: clone,
                key: component
            }
        })
    }
    const getField = (key) => {
        if (selected.components[key])
            switch (key) {
            case COMPONENTS.LINE: {
                return (
                    <Line
                        selected={selected.components[COMPONENTS.LINE]}
                        submit={(key, value) => selected.components[COMPONENTS.LINE][key] = value}
                    />
                )
            }

            case COMPONENTS.CAMERA: {
                return (
                    <Camera
                        selected={selected.components[COMPONENTS.CAMERA]}
                        submit={(key, value) => selected.components[COMPONENTS.CAMERA][key] = value}
                    />
                )
            }
            case COMPONENTS.TRANSFORM: {
                return (
                    <Transform
                        entityID={selected.id}
                        engine={engine}

                        selected={selected.components[COMPONENTS.TRANSFORM]}
                        submitRotation={(axis, data) => updateTransform(axis, data, "rotation", engine, selected.id)}
                        submitScaling={(axis, data) => updateTransform(axis, data, "scaling", engine, selected.id)}
                        submitTranslation={(axis, data) => updateTransform(axis, data, "translation", engine, selected.id)}
                    />
                )
            }
            case COMPONENTS.MESH: {
                return (
                    <Mesh
                        quickAccess={quickAccess}
                        submit={(mesh, type) => {

                            // TODO - Load mesh if not loaded
                            if (!type)
                                selected.components[COMPONENTS.MESH].meshID = mesh
                            else
                                selected.components[COMPONENTS.MESH].meshType = mesh
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    data: selected.components[COMPONENTS.MESH],
                                    key: COMPONENTS.MESH
                                }
                            })
                        }}
                        engine={engine}
                        selected={selected.components[COMPONENTS.MESH]}
                    />
                )
            }
            case COMPONENTS.MATERIAL: {
                return (
                    <Material
                        entityID={selected.id}
                        engine={engine}
                        submitRadius={r => submit(COMPONENTS.MATERIAL, "radius", r)}
                        quickAccess={quickAccess}
                        selected={selected.components[COMPONENTS.MATERIAL]}

                        submit={async (val, key) => {
                            if (key) {
                                submit(COMPONENTS.MATERIAL, key, val)
                            } else {
                                if (val) {
                                    const exists = engine.materials.find(m => m.id === val.id)
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
                                const clone = cloneClass(selected.components[COMPONENTS.MATERIAL])
                                if (val) {
                                    clone.materialID = val.id
                                    clone.uniforms = val.blob.uniforms
                                } else
                                    clone.materialID = FALLBACK_MATERIAL

                                engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                                    payload: {
                                        entityID: engine.selected[0],
                                        data: clone,
                                        key: COMPONENTS.MATERIAL
                                    }
                                })

                            }
                        }}

                    />
                )
            }
            case COMPONENTS.DIRECTIONAL_LIGHT:
            case COMPONENTS.POINT_LIGHT: {
                return (
                    <Lights
                        entityID={selected.id}
                        type={key}
                        selected={selected.components[key]}
                        submit={(data, k) => submit(key, k, data)}
                        quickAccess={quickAccess}
                        submitColor={(data) => submit(key, "color", data)}
                    />
                )
            }

            case COMPONENTS.PROBE: {
                return (
                    <Probe
                        selected={selected.components[key]}
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
        if ((parseInt(currentTab) > -1 || currentTab === ENTITY_TAB) && selected && !engine.executingAnimation && selected.components && !selected.components[COMPONENTS.FOLDER]) {
            if (!currentKey)
                setCurrentKey(Object.keys(selected.components)[0])
            const data = getField(Object.keys(selected.components)[currentTab])

            return {
                open: true,
                content: (
                    <div className={styles.formsWrapper}>
                        {currentTab !== ENTITY_TAB ?
                            data
                            :
                            <Scripts
                                scripts={quickAccess.scripts}
                                entity={selected}
                            />
                        }
                    </div>
                ),
                name: selected.name,
                selected: selected
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
                        {currentTab === "-3" ? <Editor/> : null}
                    </div>
                ),
                selected: selected
            }

    }, [selected, currentKey, engine.executingAnimation, currentTab, engine.selected[0], engine.entities])
}