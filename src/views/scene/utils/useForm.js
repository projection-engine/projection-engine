import React, {useMemo, useState} from "react";
import TransformComponent from "../forms/TransformComponent";

import SkyboxComponent from "../forms/SkyboxComponent";
import LightComponent from "../forms/LightComponent";
import MaterialComponent from "../forms/MaterialComponent";
import MeshComponent from "../forms/MeshComponent";

import styles from '../styles/Scene.module.css'
import CubeMapComponent from "../forms/CubeMapComponent";
import {ENTITY_ACTIONS} from "../../../services/utils/entityReducer";
import importMaterial from "../../../services/utils/importMaterial";
import Transformation from "../../../services/engine/utils/workers/Transformation";
import cloneClass from "../../../services/utils/misc/cloneClass";
import COMPONENTS from "../../../services/engine/templates/COMPONENTS";
import CameraComponent from "../forms/CameraComponent";

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


    const getField = (key) => {

        switch (key) {
            case COMPONENTS.CAMERA: {
                return (
                    <CameraComponent
                        selected={selected.components[COMPONENTS.CAMERA]}
                        submit={(value, key) => selected.components[COMPONENTS.CAMERA][key] = value}
                    />
                )
            }
            case COMPONENTS.TRANSFORM: {
                return (
                    <TransformComponent
                        entityID={selected.id}
                        engine={engine}

                        selected={selected.components[COMPONENTS.TRANSFORM]}
                        submitRotation={(axis, data) => Transformation.updateTransform(axis, data, 'rotation', engine, engine.selected[0], setAlert)}
                        submitScaling={(axis, data) => Transformation.updateTransform(axis, data, 'scaling', engine, engine.selected[0], setAlert)}
                        submitTranslation={(axis, data) => Transformation.updateTransform(axis, data, 'translation', engine, engine.selected[0], setAlert)}
                    />
                )
            }

            case COMPONENTS.MESH: {
                return (
                        <MeshComponent
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
                    <MaterialComponent
                        entityID={selected.id}
                        engine={engine}

                        submitRadius={r => {
                            const clone = cloneClass(selected.components[COMPONENTS.MATERIAL])
                            clone.radius = r
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    data: clone,
                                    key: COMPONENTS.MATERIAL
                                }
                            })
                        }}
                        quickAccess={quickAccess}
                        selected={selected.components[COMPONENTS.MATERIAL]}
                        submitTiling={(tiling, allow) => {
                            const clone = cloneClass(selected.components[COMPONENTS.MATERIAL])
                            if (allow === undefined) {
                                clone.tiling = tiling
                            } else
                                clone.overrideTiling = allow
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    data: clone,
                                    key: COMPONENTS.MATERIAL
                                }
                            })
                        }}
                        submit={(mat) => {
                            const clone = cloneClass(selected.components[COMPONENTS.MATERIAL])
                            if (mat) {
                                importMaterial(mat, engine, load)
                                clone.materialID = mat.id
                            } else
                                clone.materialID = undefined
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    data: clone,
                                    key: COMPONENTS.MATERIAL
                                }
                            })
                        }}
                        setAlert={setAlert}

                    />
                )
            }
            case COMPONENTS.SKYLIGHT:
            case COMPONENTS.DIRECTIONAL_LIGHT:
            case COMPONENTS.POINT_LIGHT: {
                return (
                    <LightComponent
                        entityID={selected.id}
                        engine={engine}

                        type={key}
                        selected={selected.components[key]}
                        submit={(data, k) => {
                            const component = selected.components[key]
                            component[k] = data
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    key: key,
                                    data: component
                                }
                            })
                        }}

                        quickAccess={quickAccess}
                        submitPlacement={(axis, data) => {

                            const component = selected.components[key]
                            const prev = component.direction
                            component.direction = [
                                axis === 'x' ? data : prev[0],
                                axis === 'y' ? data : prev[1],
                                axis === 'z' ? data : prev[2]
                            ]
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    key: key,
                                    data: component
                                }
                            })
                        }}
                        submitColor={(data) => {
                            const component = selected.components[key]
                            component['color'] = data

                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: engine.selected[0],
                                    key: key,
                                    data: component
                                }
                            })
                        }}
                    />
                )
            }

            case COMPONENTS.CUBE_MAP: {
                return (
                    <CubeMapComponent
                        selected={selected.components[key]}
                        submit={(data, key) => {
                            selected.components[COMPONENTS.CUBE_MAP][key] = data
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                                payload: {
                                    entityID: engine.selected[0],
                                    data: selected.components[COMPONENTS.CUBE_MAP],
                                    key: COMPONENTS.CUBE_MAP
                                }
                            })
                            setAlert({message: 'Reflection captures need to be rebuilt', type: 'alert'})
                        }}
                    />
                )
            }
            case COMPONENTS.SKYBOX: {
                return (
                    <SkyboxComponent
                        quickAccess={quickAccess}
                        selected={selected.components[COMPONENTS.SKYBOX]}
                        submit={(data, key) => {

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
    }


    return useMemo(() => {

        if (selected && !executingAnimation && !selected.components[COMPONENTS.FOLDER]) {
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
        } else {
            if (currentKey)
                setCurrentKey(undefined)
            return {
                open: false,
                content: (
                    <div className={styles.emptyWrapper}>
                    <span style={{fontSize: executingAnimation ? '140px' : '90px'}}
                          className={'material-icons-round'}>{executingAnimation ? 'play_arrow' : 'category'}</span>
                        {executingAnimation ? 'Stop the simulation to change attributes.' : 'Select an entity to edit it.'}
                    </div>
                )
            }
        }

    }, [selected, currentKey, executingAnimation, currentTab, engine.selected[0], engine.entities])
}