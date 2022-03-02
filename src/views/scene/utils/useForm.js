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
import EVENTS from "../../../services/utils/misc/EVENTS";
import cloneClass from "../../../services/utils/misc/cloneClass";

export default function useForm(
    engine,
    allSelected,
    setAlert,
    executingAnimation,
    quickAccess,
    load
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
                            selected={selected.components.MeshComponent.meshID}
                        />

                    </>
                )
            }
            case 'MaterialComponent': {
                return (
                    <MaterialComponent
                        quickAccess={quickAccess}
                        materialID={selected.components.MaterialComponent.materialID}
                        submit={(mat) => {
                            importMaterial(mat, engine, load)

                            const clone = cloneClass(selected.components.MaterialComponent)
                            clone.materialID = mat.id
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
                        type={key}
                        selected={selected.components[key]}
                        quickAccess={quickAccess}
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
                        selected={selected.components.SkyboxComponent}
                        submit={data => {

                            selected.components.SkyboxComponent.hdrTexture = {
                                blob: data.blob,
                                imageID: data.id
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
                                width: '100%',
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
                <div className={styles.emptyWrapper}>
                    <span style={{fontSize: executingAnimation ? '140px' : '90px'}}
                          className={'material-icons-round'}>{executingAnimation ? 'play_arrow' : 'category'}</span>
                    {executingAnimation ? 'Stop the simulation to change attributes.' : 'Select an entity to edit it.'}

                </div>
            )
        }

    }, [selected, allSelected, currentKey, executingAnimation])
}