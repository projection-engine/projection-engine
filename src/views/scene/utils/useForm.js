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

export default function useForm(
    engine,
    allSelected,
    setAlert,
    executingAnimation,
    quickAccess,
    load,
    currentTab
) {
    const selectedElement = allSelected.length > 1 ? undefined : allSelected[0]

    const [currentKey, setCurrentKey] = useState()
    const selected = useMemo(() => {
        setCurrentKey(undefined)
        return engine.entities.find(e => e.id === selectedElement)
    }, [allSelected])


    const getField = (key) => {

        switch (key) {
            case 'TransformComponent': {
                return (
                    <TransformComponent
                        selected={selected.components.TransformComponent}
                        submitRotation={(axis, data) => Transformation.updateTransform(axis, data, 'rotation', engine, selectedElement)}
                        submitScaling={(axis, data) => Transformation.updateTransform(axis, data, 'scaling', engine, selectedElement)}
                        submitTranslation={(axis, data) => Transformation.updateTransform(axis, data, 'translation', engine, selectedElement)}
                    />
                )
            }
            case 'MeshComponent': {
                return (
                    <>
                        <MeshComponent
                            quickAccess={quickAccess}
                            load={load} setAlert={setAlert}
                            submit={(mesh, type) => {
                                if (!type)
                                    selected.components.MeshComponent.meshID = mesh
                                 else
                                    selected.components.MeshComponent.meshType = mesh

                                engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                        entityID: selectedElement,
                                        data: selected.components.MeshComponent,
                                        key: 'MeshComponent'
                                    }
                                })
                            }}
                            engine={engine}
                            selected={selected.components.MeshComponent}
                        />

                    </>
                )
            }
            case 'MaterialComponent': {
                return (
                    <MaterialComponent
                        quickAccess={quickAccess}
                        selected={selected.components.MaterialComponent}
                        submitTiling={(tiling, allow) => {
                            const clone = cloneClass(selected.components.MaterialComponent)
                            if (!allow) {
                                clone.tiling = tiling

                            } else
                                clone.overrideTiling = allow
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selectedElement,
                                    data: clone,
                                    key: 'MaterialComponent'
                                }
                            })
                        }}
                        submit={(mat) => {
                            const clone = cloneClass(selected.components.MaterialComponent)
                            if (mat) {
                                importMaterial(mat, engine, load)
                                clone.materialID = mat.id
                            } else
                                clone.materialID = undefined
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selectedElement,
                                    data: clone,
                                    key: 'MaterialComponent'
                                }
                            })
                        }}
                        setAlert={setAlert}

                    />
                )
            }
            case 'SkylightComponent':
            case 'DirectionalLightComponent':
            case 'PointLightComponent': {
                return (
                    <LightComponent
                        type={key}
                        selected={selected.components[key]}
                        submit={(data, k) => {
                            const component = selected.components[key]
                            component[k] = data
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selectedElement,
                                    key: key,
                                    data: component
                                }
                            })
                        }}

                        quickAccess={quickAccess}
                        submitPlacement={(axis, data) => {
                            const k = key === 'DirectionalLightComponent' ? 'direction' : 'position'
                            const component = selected.components[key]
                            const prev = component[k]
                            component[k] = [
                                axis === 'x' ? data : prev[0],
                                axis === 'y' ? data : prev[1],
                                axis === 'z' ? data : prev[2]
                            ]
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selectedElement,
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
                                    entityID: selectedElement,
                                    key: key,
                                    data: component
                                }
                            })
                        }}
                    />
                )
            }

            case 'CubeMapComponent': {
                return (
                    <CubeMapComponent
                        selected={selected.components[key]}
                        submit={(data, key) => {
                            selected.components.CubeMapComponent[key] = data
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                                payload: {
                                    entityID: selectedElement,
                                    data: selected.components.CubeMapComponent,
                                    key: 'CubeMapComponent'
                                }
                            })
                        }}
                    />
                )
            }
            case 'SkyboxComponent': {
                return (
                    <SkyboxComponent
                        quickAccess={quickAccess}
                        selected={selected.components.SkyboxComponent}
                        submit={(data, key) => {

                            selected.components.SkyboxComponent[key] = data
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                                payload: {
                                    entityID: selectedElement,
                                    data: selected.components.SkyboxComponent,
                                    key: 'SkyboxComponent'
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
        if (selected && !executingAnimation && !selected.components.FolderComponent) {
            if (!currentKey) {
                setCurrentKey(Object.keys(selected.components)[0])
            }
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

    }, [selected, allSelected, currentKey, executingAnimation, currentTab])
}