import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import Entity from "../../../libs/engine/templates/basic/Entity";
import dispatchEntities, {ENTITY_ACTIONS} from "../../../stores/dispatch-entities";
import DataStoreController from "../../../stores/DataStoreController";
import ViewportActions from "../../../libs/ViewportActions";
import CameraComponent from "../../../libs/engine/templates/components/CameraComponent";
import PointLightComponent from "../../../libs/engine/templates/components/PointLightComponent";
import TransformComponent from "../../../libs/engine/templates/components/TransformComponent";
import DirectionalLightComponent from "../../../libs/engine/templates/components/DirectionalLightComponent";
import Renderer from "../../../libs/engine/Renderer";

function createEntity(component) {
    const entity = new Entity(undefined, "New Entity")
    if (component) {
        entity.components[COMPONENTS.TRANSFORM] = new TransformComponent()
        entity.components[component.key] = new component.ref(undefined, entity)
    }
    dispatchEntities({
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

export default function getContextMenu(open, setOpen) {
    const SELECTION = [

        {
            label: "Select all",
            onClick: () => ViewportActions.selectAll()
        },
        {
            label: "Invert selection",
            onClick: () => ViewportActions.invertSelection()
        },
        {
            label: "Select none",
            onClick: () => DataStoreController.updateEngine({...DataStoreController.engine, selected: []})
        },
        {
            label: "Close all",
            onClick: () => setOpen({})
        }
    ]
    return [
        ...SELECTION.map(v => ({
            ...v,
            requiredTrigger: "data-self"
        })),
        {divider: true, requiredTrigger: "data-self"},
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
        {divider: true, requiredTrigger: "data-node"},
        ...SELECTION.map(v => ({
            ...v,
            requiredTrigger: "data-node"
        })),
        {divider: true, requiredTrigger: "data-node"},
        {
            requiredTrigger: "data-node",
            label: "Close parent",
            onClick: (target) => {
                const newOpen = {...open}
                const node = Renderer.entitiesMap.get(target.getAttribute("data-node"))
                if (!node)
                    return
                delete newOpen[node.parent.id]
                setOpen(newOpen)
            }
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
                    dispatchEntities({
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
                dispatchEntities({
                    type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: [...toRemove, t]
                })

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