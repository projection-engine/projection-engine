import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import Entity from "../../../libs/engine/production/templates/Entity";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
import EngineStore from "../../../stores/EngineStore";
import ViewportActions from "../../../libs/ViewportActions";
import CameraComponent from "../../../libs/engine/production/templates/CameraComponent";
import PointLightComponent from "../../../libs/engine/production/templates/PointLightComponent";
import DirectionalLightComponent from "../../../libs/engine/production/templates/DirectionalLightComponent";
import RendererController from "../../../libs/engine/production/controllers/RendererController";

function createEntity(component) {
    const entity = new Entity(undefined, "New Entity")
    if (component)
        entity.components[component.key] = new component.ref(undefined, entity)
    dispatchRendererEntities({
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

export default function getEngineContextMenu(open, setOpen) {
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
            onClick: () => EngineStore.updateStore({...EngineStore.engine, selected: []})
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
                const node = RendererController.entitiesMap.get(target.getAttribute("data-node"))
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
                const entity = RendererController.entitiesMap.get(t)
                if (entity)
                    dispatchRendererEntities({
                        type: ENTITY_ACTIONS.ADD,
                        payload: entity.clone()
                    })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Remove entity",
            icon: "delete",
            onClick: (node) => dispatchRendererEntities({type: ENTITY_ACTIONS.REMOVE, payload: node.getAttribute("data-node")})
        },

        {requiredTrigger: "data-node", divider: true},
        {
            requiredTrigger: "data-node",
            label: "Deselect",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                EngineStore.updateStore({
                    ...EngineStore.engine,
                    selected: EngineStore.engine.selected.filter(s => s !== t)
                })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Deselect hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toDeselect = [t, ...getHierarchy(RendererController.entitiesMap.get(t))]
                EngineStore.updateStore({
                    ...EngineStore.engine,
                    selected: EngineStore.engine.selected.filter(s => toDeselect.includes(s))
                })
            }
        },
        {requiredTrigger: "data-node", divider: true},
        {
            requiredTrigger: "data-node",
            label: "Select",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                EngineStore.updateStore({
                    ...EngineStore.engine,
                    selected: [...EngineStore.engine.selected, t]
                })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Select hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toSelect = [t, ...getHierarchy(RendererController.entitiesMap.get(t))]
                EngineStore.updateStore({
                    ...EngineStore.engine,
                    selected: [...EngineStore.engine.selected, ...toSelect]
                })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Focus",
            icon: "place",
            onClick: (target) => ViewportActions.focus(RendererController.entitiesMap.get(target.getAttribute("data-node")))
        },
    ]
}