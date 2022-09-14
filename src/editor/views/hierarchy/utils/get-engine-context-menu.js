import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.json";
import Entity from "../../../../../public/engine/production/instances/Entity";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
import ViewportActions from "../../../libs/ViewportActions";
import SelectionStore from "../../../stores/SelectionStore";
import QueryAPI from "../../../../../public/engine/production/apis/utils/QueryAPI";

function createEntity(component) {
    const entity = new Entity(undefined, "New Entity")
    if (component)
        entity.addComponent(component)
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
            onClick: () => SelectionStore.engineSelected = []
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
                    onClick: () => createEntity(   COMPONENTS.DIRECTIONAL_LIGHT)
                },
                {
                    label: "Point light",
                    onClick: () => createEntity(  COMPONENTS.POINT_LIGHT)
                },
            ]
        },
        {
            requiredTrigger: "data-self",
            label: "Camera",
            onClick: () => createEntity( COMPONENTS.CAMERA)
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
                const node = QueryAPI.getEntityByID(target.getAttribute("data-node"))
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
                const entity = QueryAPI.getEntityByID(t)
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
            onClick: (node) => dispatchRendererEntities({
                type: ENTITY_ACTIONS.REMOVE,
                payload: node.getAttribute("data-node")
            })
        },

        {requiredTrigger: "data-node", divider: true},
        {
            requiredTrigger: "data-node",
            label: "Deselect",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                SelectionStore.engineSelected = SelectionStore.engineSelected.filter(s => s !== t)
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Deselect hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toDeselect = [t, ...getHierarchy(QueryAPI.getEntityByID(t))]
                SelectionStore.engineSelected = SelectionStore.engineSelected.filter(s => toDeselect.includes(s))
            }
        },
        {requiredTrigger: "data-node", divider: true},
        {
            requiredTrigger: "data-node",
            label: "Select",
            onClick: (target) => {
                const t = target.getAttribute("data-node")

                SelectionStore.engineSelected = [...SelectionStore.engineSelected, t]

            }
        },
        {
            requiredTrigger: "data-node",
            label: "Select hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toSelect = [t, ...getHierarchy(QueryAPI.getEntityByID(t))]
                SelectionStore.engineSelected = [...SelectionStore.engineSelected, ...toSelect]

            }
        },
        {
            requiredTrigger: "data-node",
            label: "Focus",
            icon: "place",
            onClick: (target) => ViewportActions.focus(QueryAPI.getEntityByID(target.getAttribute("data-node")))
        },
    ]
}