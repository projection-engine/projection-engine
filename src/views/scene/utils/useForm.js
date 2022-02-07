import React, {useMemo, useState} from "react";
import TransformComponent from "../forms/TransformComponent";

import SkyboxComponent from "../forms/SkyboxComponent";
import LightComponent from "../forms/LightComponent";
import MaterialComponent from "../forms/MaterialComponent";
import MeshComponent from "../forms/MeshComponent";

import styles from '../styles/Scene.module.css'
import CubeMapComponent from "../forms/CubeMapComponent";
import {ENTITY_ACTIONS} from "../../../services/engine/ecs/utils/entityReducer";
import ColliderComponent from "../../../services/engine/ecs/components/ColliderComponent";
import MaterialInstance from "../../../services/engine/renderer/elements/MaterialInstance";

export default function useForm(
    engine,
    selectedElement,
    setAlert,
    executingAnimation,
    quickAccess,
    database
) {

    const [currentKey, setCurrentKey] = useState()
    const selected = useMemo(() => {
        setCurrentKey(undefined)
        return engine.entities.find(e => e.id === selectedElement)
    }, [selectedElement])

    const updateTransform = (axis, data, key) => {
        const component = selected.components.TransformComponent
        const prev = component[key]
        component[key] = [
            axis === 'x' ? data : prev[0],
            axis === 'y' ? data : prev[1],
            axis === 'z' ? data : prev[2]
        ]
        engine.dispatchEntities({
            type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                entityID: selectedElement,
                key: 'TransformComponent',
                data: component
            }
        })
    }

    const getField = (key) => {

        switch (key) {
            case 'TransformComponent': {
                return (
                    <TransformComponent
                        selected={selected.components.TransformComponent}
                        submitRotation={(axis, data) => updateTransform(axis, data, 'rotation')}
                        submitScaling={(axis, data) => updateTransform(axis, data, 'scaling')}
                        submitTranslation={(axis, data) => updateTransform(axis, data, 'translation')}
                    />
                )
            }
            case 'MeshComponent': {
                return (
                    <MeshComponent
                        quickAccess={quickAccess}
                        database={database}
                        meshes={engine.meshes}
                        submitPhysics={(add) => {
                            if (add) {
                                const physicsComponent = new PhysicsBodyComponent()
                                engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                                        entityID: selectedElement,
                                        data: physicsComponent
                                    }
                                })
                            } else
                                engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.REMOVE_COMPONENT, payload: {
                                        entityID: selectedElement,
                                        key: 'PhysicsComponent'
                                    }
                                })
                        }}
                        submitPhysicsCollider={(add) => {
                            if (add) {
                                const mesh = engine.meshes.find(m => m.id === selected.components.MeshComponent.meshID)

                                const physicsComponent = new ColliderComponent(undefined, mesh)
                                engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                                        entityID: selectedElement,
                                        data: physicsComponent
                                    }
                                })
                            } else
                                engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.REMOVE_COMPONENT, payload: {
                                        entityID: selectedElement,
                                        key: 'SphereCollider'
                                    }
                                })
                        }}
                        submit={(mesh) => {
                            selected.components.MeshComponent.meshID = mesh

                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selectedElement,
                                    data: selected.components.MeshComponent,
                                    key: 'MeshComponent'
                                }
                            })
                        }}
                        engine={engine}
                        selected={selected}
                    />
                )
            }
            case 'MaterialComponent': {
                return (
                    <MaterialComponent
                        quickAccess={quickAccess}
                        database={database}
                        selected={selected.components.MaterialComponent}
                        submit={(mat, textures) => {

                            let found = engine.materials.find(m => m.id === mat.id)
                            if (!found)
                                engine.setMaterials(prev => {
                                    return [...prev, new MaterialInstance(engine.gpu, mat.id, textures[0], textures[1], textures[2], textures[3], textures[4], textures[5])]
                                })

                            selected.components.MaterialComponent.materialID = mat.id
                            selected.components.MaterialComponent.name = mat.name
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selectedElement,
                                    data: selected.components.MaterialComponent,
                                    key: 'MaterialComponent'
                                }
                            })
                        }}
                        setAlert={setAlert}

                    />
                )
            }
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
                        database={database}
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
                        type={key}
                        selected={selected.components[key]}
                        quickAccess={quickAccess}
                        database={database}
                        submitPlacement={(axis, data) => {
                            const k = 'position'
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
                        submitData={(k, data) => {
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
                    />
                )
            }
            case 'SkyboxComponent': {
                return (
                    <SkyboxComponent
                        quickAccess={quickAccess}
                        database={database}
                        selected={selected.components.SkyboxComponent}
                        submit={data => {
                            selected.components.SkyboxComponent.hdrTexture = {
                                blob: data.blob,
                                imageID: data.id,
                                type: data.type
                            }
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
                return
        }
    }


    return useMemo(() => {
        if (selected && !executingAnimation && !selected.components.FolderComponent) {
            if (!currentKey) {
                setCurrentKey(Object.keys(selected.components)[0])
            }
            const data = Object.keys(selected.components).map((k, i) => {
                const field = getField(k)

                if (field)
                    return (
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}
                        >
                            {field}
                        </div>
                    )
                else
                    return <></>
            })

            return (
                <div className={styles.formsWrapper}>
                    {data.map((d, i) => (
                       <React.Fragment key={'component-field-' + i}>
                           {d}
                       </React.Fragment>
                    ))}
                </div>
            )
        } else {
            if (currentKey)
                setCurrentKey(undefined)
            return (
                <div className={styles.formsWrapper}
                     style={{justifyContent: 'center', fontWeight: '550', padding: '0 16px'}}>
                    <span style={{fontSize: executingAnimation ? '150px' : '100px'}}
                          className={'material-icons-round'}>{executingAnimation ? 'play_arrow' : 'category'}</span>
                    {executingAnimation ? 'Stop the simulation to change attributes.' : 'Select an entity to edit it.'}

                </div>
            )
        }

    }, [selected, selectedElement, currentKey, executingAnimation])
}