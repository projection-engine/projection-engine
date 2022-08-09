import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import Entity from "../../../libs/engine/libs/basic/Entity";
import {ENTITY_ACTIONS} from "../../../libs/engine-extension/entityReducer";
import DataStoreController from "../../../stores/DataStoreController";
import ViewportActions from "../../../libs/ViewportActions";
import CameraComponent from "../../../libs/engine/libs/components/CameraComponent";
import PointLightComponent from "../../../libs/engine/libs/components/PointLightComponent";
import TransformComponent from "../../../libs/engine/libs/components/TransformComponent";
import DirectionalLightComponent from "../../../libs/engine/libs/components/DirectionalLightComponent";
import Renderer from "../../../libs/engine/Renderer";

function createEntity(component) {
    const entity = new Entity(undefined, "New Entity")
    if (component) {
        entity.components[COMPONENTS.TRANSFORM] = new TransformComponent()
        entity.components[component.key] = new component.ref(undefined, entity)
    }
    DataStoreController.engine.dispatchEntities({
        type: ENTITY_ACTIONS.ADD, payload: entity
    })
}

const getHierarchy = (start) => {
    const result = []
    const direct = start.children
    direct.forEach(d => {
        result.push(...getHierarchy(d))
    })
    result.push(...direct.map(c => c.id))
    return result
}

export default function getContextMenu() {
    return [

        {
            requiredTrigger: "data-self",
            label: "Empty entity",
            onClick: () => createEntity()
        },
        {
            requiredTrigger: "data-self",
            label: "Light",
            children: [
                {
                    label: "Directional light",
                    onClick: () => createEntity({ref: DirectionalLightComponent, key: COMPONENTS.DIRECTIONAL_LIGHT})
                },
                {
                    label: "Point light",
                    onClick: () => createEntity({ref: PointLightComponent, key: COMPONENTS.POINT_LIGHT})
                },
            ]
        },
        {
            requiredTrigger: "data-self",
            label: "Camera",
            onClick: () => createEntity({ref: CameraComponent, key: COMPONENTS.CAMERA})
        },
        {divider: true, requiredTrigger: "data-self"},
        {
            requiredTrigger: "data-self",
            label: "Paste",
            onClick: () => ViewportActions.paste()
        },
        {
            requiredTrigger: "data-node",
            label: "Paste",
            onClick: (target) => ViewportActions.paste(target.getAttribute("data-node"))
        },

        {
            requiredTrigger: "data-node",
            label: "Copy",
            onClick: (target) => ViewportActions.copy(false, target.getAttribute("data-node"))
        },

        {
            requiredTrigger: "data-node",
            label: "Duplicate",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const entity = Renderer.entitiesMap.get(t)
                if (entity)
                    DataStoreController.engine.dispatchEntities({
                        type: ENTITY_ACTIONS.ADD,
                        payload: entity.clone()
                    })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Remove entity",
            icon: "delete",
            onClick: (node) => {
                const t = node.getAttribute("data-node")
                const toRemove = getHierarchy(Renderer.entitiesMap.get(t)).map(e => e.id)
                DataStoreController.engine.dispatchEntities({
                    type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: [...toRemove, t]
                }, {...DataStoreController.engine, selected: []})

            }
        },

        {requiredTrigger: "data-node", divider: true},
        {
            requiredTrigger: "data-node",
            label: "Deselect",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                DataStoreController.updateEngine({
                    ...DataStoreController.engine,
                    selected: DataStoreController.engine.selected.filter(s => s !== t)
                })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Deselect hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toDeselect = [t, ...getHierarchy(Renderer.entitiesMap.get(t))]
                DataStoreController.updateEngine({
                    ...DataStoreController.engine,
                    selected: DataStoreController.engine.selected.filter(s => toDeselect.includes(s))
                })
            }
        },
        {requiredTrigger: "data-node", divider: true},
        {
            requiredTrigger: "data-node",
            label: "Select",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                DataStoreController.updateEngine({
                    ...DataStoreController.engine,
                    selected: [...DataStoreController.engine.selected, t]
                })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Select hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toSelect = [t, ...getHierarchy(Renderer.entitiesMap.get(t))]
                DataStoreController.updateEngine({
                    ...DataStoreController.engine,
                    selected: [...DataStoreController.engine.selected, ...toSelect]
                })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Focus",
            icon: "place",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const entity = Renderer.entitiesMap.get(t)
                const comp = entity ? entity.components[COMPONENTS.TRANSFORM] : undefined
                if (entity && comp) {
                    const t = comp.translation

                    window.renderer.camera.radius = 10
                    window.renderer.camera.centerOn = t

                    window.renderer.camera.updateViewMatrix()
                }
            }
        },
    ]
}