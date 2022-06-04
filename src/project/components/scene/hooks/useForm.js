import React, {useMemo, useState} from "react"
import Transform from "../components/Transform"

import Skybox from "../components/Skybox"
import Lights from "../components/Lights"
import Material from "../components/Material"
import Mesh from "../components/Mesh"

import styles from "../styles/Scene.module.css"
import CubeMap from "../components/CubeMap"
import {ENTITY_ACTIONS} from "../../../engine/useEngineEssentials"
import cloneClass from "../../../engine/utils/cloneClass"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import Camera from "../components/Camera"
import MaterialInstance from "../../../engine/instances/MaterialInstance"
import Script from "../components/Script"
import Rendering from "../components/Rendering"
import Display from "../components/Display"
import Editor from "../components/Editor"
import Line from "../components/Line"
import LightProbe from "../components/LightProbe"
import FileSystem from "../../../utils/files/FileSystem"

export function  updateTransform(axis, data, key, engine, entityID, setAlert) {

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
    if (entity.components[COMPONENTS.CUBE_MAP])
        setAlert({message: "Reflection captures need to be rebuilt", type: "alert"})
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
    setAlert,
    executingAnimation,
    quickAccess,
    load,
    currentTab
) {
    const [currentKey, setCurrentKey] = useState()
    const selected = useMemo(() => {
        setCurrentKey(undefined)
        return engine.entities.find(e => !engine.lockedEntity && e.id === engine.selected[0] || engine.lockedEntity === e.id)
    }, [engine.selected, engine.entities, engine.lockedEntity])

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
            case COMPONENTS.PROBE: {
                return (
                    <LightProbe
                        selected={selected.components[COMPONENTS.PROBE]}
                        submit={(key, value) => selected.components[COMPONENTS.PROBE][key] = value}
                        addProbe={() => {
                            selected.components[COMPONENTS.PROBE].addProbe()
                            submit(COMPONENTS.PROBE, "probes", selected.components[COMPONENTS.PROBE].probes)
                        }}
                        removeProbe={(s) => {
                            selected.components[COMPONENTS.PROBE].removeProbe(s)
                            submit(COMPONENTS.PROBE, "probes", selected.components[COMPONENTS.PROBE].probes)
                        }}
                        submitProbe={(translation, s) => {
                            selected.components[COMPONENTS.PROBE].updateProbe(s, "translation", translation)
                            submit(COMPONENTS.PROBE, "probes", selected.components[COMPONENTS.PROBE].probes)
                        }}
                    />
                )
            }
            case COMPONENTS.LINE: {
                return (
                    <Line
                        selected={selected.components[COMPONENTS.LINE]}
                        submit={(key, value) => selected.components[COMPONENTS.LINE][key] = value}
                    />
                )
            }
            case COMPONENTS.SCRIPT: {
                return (
                    <Script
                        quickAccess={quickAccess}
                        selected={selected.components[COMPONENTS.SCRIPT]}
                        submit={async (value, add) => {
                            if (add && !selected.components[COMPONENTS.SCRIPT].scripts.find(s => s === value)) {
                                selected.components[COMPONENTS.SCRIPT].scripts.push(value)
                                if (!engine.scripts.find(s => s.id === value)) {

                                    const rs = await quickAccess.fileSystem.readRegistryFile(value)
                                    if (rs) {
                                        const file = await quickAccess.fileSystem.readFile(quickAccess.fileSystem.path + FileSystem.sep + "assets" +FileSystem.sep +  rs.path)
                                        if (file)
                                            engine.setScripts(prev => {
                                                return [...prev, {
                                                    id: value,
                                                    executors: file
                                                }]
                                            })
                                        else {
                                            setAlert({
                                                type: "error",
                                                message: "Error loading file."
                                            })
                                            return null
                                        }
                                    }
                                }
                            } else if (!add)
                                selected.components[COMPONENTS.SCRIPT].scripts = selected.components[COMPONENTS.SCRIPT].scripts.filter(s => s !== value)
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    data: selected.components[COMPONENTS.SCRIPT],
                                    key: COMPONENTS.SCRIPT
                                }
                            })
                        }}
                    />
                )
            }
            case COMPONENTS.CAMERA: {
                return (
                    <Camera
                        selected={selected.components[COMPONENTS.CAMERA]}
                        submit={(value, key) => selected.components[COMPONENTS.CAMERA][key] = value}
                    />
                )
            }
            case COMPONENTS.TRANSFORM: {
                return (
                    <Transform
                        entityID={selected.id}
                        engine={engine}

                        selected={selected.components[COMPONENTS.TRANSFORM]}
                        submitRotation={(axis, data) => updateTransform(axis, data, "rotation", engine, engine.selected[0], setAlert)}
                        submitScaling={(axis, data) => updateTransform(axis, data, "scaling", engine, engine.selected[0], setAlert)}
                        submitTranslation={(axis, data) => updateTransform(axis, data, "translation", engine, engine.selected[0], setAlert)}
                    />
                )
            }
            case COMPONENTS.MESH: {
                return (
                    <Mesh
                        quickAccess={quickAccess}
                        load={load} setAlert={setAlert}
                        submit={(mesh, type) => {
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
                                            newMat = new MaterialInstance(engine.gpu, val.blob.vertexShader, val.blob.shader, val.blob.uniformData, val.blob.settings, () => resolve(), val.id)
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
                                    clone.materialID = undefined

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
                        setAlert={setAlert}

                    />
                )
            }
            case COMPONENTS.SKYLIGHT:
            case COMPONENTS.DIRECTIONAL_LIGHT:
            case COMPONENTS.POINT_LIGHT: {
                return (
                    <Lights
                        entityID={selected.id}
                        engine={engine}

                        type={key}
                        selected={selected.components[key]}
                        submit={(data, k) => {
                            submit(key, k, data)
                        }}

                        quickAccess={quickAccess}
                        submitPlacement={(axis, data) => {

                            const component = selected.components[key]
                            const prev = component.direction
                            component.direction = [
                                axis === "x" ? data : prev[0],
                                axis === "y" ? data : prev[1],
                                axis === "z" ? data : prev[2]
                            ]
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    key: key,
                                    data: component
                                }
                            })
                        }}
                        submitColor={(data) => submit(key, "color", data)}
                    />
                )
            }

            case COMPONENTS.CUBE_MAP: {
                return (
                    <CubeMap
                        selected={selected.components[key]}
                        submit={(data, key) => {
                            submit(COMPONENTS.CUBE_MAP, key, data)
                            engine.renderer.refreshCubemaps()
                            setAlert({message: "Reflection captures need to be rebuilt", type: "alert"})
                        }}
                    />
                )
            }
            case COMPONENTS.SKYBOX: {
                return (
                    <Skybox
                        quickAccess={quickAccess}
                        selected={selected.components[COMPONENTS.SKYBOX]}
                        submit={(data, key) => {
                            if (key === "blob") {
                                selected.components[COMPONENTS.SKYBOX].blob = data.blob
                                selected.components[COMPONENTS.SKYBOX].imageID = data.imageID
                            } else
                                selected.components[COMPONENTS.SKYBOX][key] = data
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                                payload: {
                                    entityID: engine.selected[0],
                                    data: selected.components[COMPONENTS.SKYBOX],
                                    key: COMPONENTS.SKYBOX
                                }
                            })
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
        if (parseInt(currentTab) > -1 && selected && !executingAnimation && selected.components && !selected.components[COMPONENTS.FOLDER]) {
            if (!currentKey)
                setCurrentKey(Object.keys(selected.components)[0])
            const data = getField(Object.keys(selected.components)[currentTab])

            return {
                open: true,
                content: (
                    <div className={styles.formsWrapper}>
                        {data}
                    </div>
                ),
                name: selected.name,
                selected: selected
            }
        } else if (executingAnimation) {
            if (currentKey)
                setCurrentKey(undefined)
            return {
                open: false,
                content: (
                    <div className={styles.emptyWrapper}>
                        <div
                            style={{
                                fontSize: "140px"
                            }}
                            className={"material-icons-round"}>play_arrow
                        </div>
                        Stop the simulation to change attributes.
                    </div>
                )
            }
        } else
            return {
                open: false,
                content: (
                    <div className={styles.formsWrapper}>
                        {currentTab === "-1" ? <Display/> : null}
                        {currentTab === "-2" ? <Rendering/> : null}
                        {currentTab === "-3" ? <Editor/> : null}
                    </div>
                ),
                selected: selected
            }

    }, [selected, currentKey, executingAnimation, currentTab, engine.selected[0], engine.entities])
}