import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import Entity from "../../../libs/engine/basic/Entity";
import FolderComponent from "../../../libs/engine/components/FolderComponent";
import {ENTITY_ACTIONS} from "../../../libs/engine-extension/entityReducer";
import DataStoreController from "../../../stores/DataStoreController";
import ViewportActions from "../../viewport/libs/ViewportActions";

function createFolder() {
    const newEntity = new Entity()
    newEntity.name = "New folder"
    newEntity.components[COMPONENTS.FOLDER] = new FolderComponent()
    DataStoreController.engine.dispatchEntities({
        type: ENTITY_ACTIONS.ADD, payload: newEntity
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

export default function getHierarchyOptions(){
    return [
        {
            requiredTrigger: "data-self",
            label: "Create folder",
            icon: "create_new_folder",
            onClick: () => createFolder(DataStoreController.engine.dispatchEntities)
        },

        {
            requiredTrigger: "data-node",
            label: "Copy",
            onClick: (target) => ViewportActions.copy(false, target.getAttribute("data-node"))
        },
        {
            requiredTrigger: "data-node",
            label: "Paste on hierarchy",
            onClick: (target) => ViewportActions.paste(target.getAttribute("data-node"))
        },
        {
            requiredTrigger: "data-node",
            label: "Duplicate",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const entity = window.renderer.entitiesMap.get(t)
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
                const toRemove = getHierarchy(window.renderer.entitiesMap.get(t)).map(e => e.id)
                DataStoreController.engine.dispatchEntities({
                    type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: [...toRemove, t]
                }, {...DataStoreController.engine, selected: []})

            }
        },

        {divider: true},
        {
            requiredTrigger: "data-node",
            label: "Deselect",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                DataStoreController.updateEngine({...DataStoreController.engine, selected: DataStoreController.engine.selected.filter(s => s !== t)})
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Deselect hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toDeselect = [t, ...getHierarchy(window.renderer.entitiesMap.get(t))]
                DataStoreController.updateEngine({...DataStoreController.engine, selected: DataStoreController.engine.selected.filter(s => toDeselect.includes(s))})
            }
        },
        {divider: true},
        {
            requiredTrigger: "data-node",
            label: "Select",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                DataStoreController.updateEngine({...DataStoreController.engine, selected:[... DataStoreController.engine.selected, t] })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Select hierarchy",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const toSelect = [t, ...getHierarchy(window.renderer.entitiesMap.get(t))]
                DataStoreController.updateEngine({...DataStoreController.engine, selected:[...DataStoreController.engine.selected, ...toSelect] })
            }
        },
        {
            requiredTrigger: "data-node",
            label: "Focus",
            icon: "place",
            onClick: (target) => {
                const t = target.getAttribute("data-node")
                const entity = window.renderer.entitiesMap.get(t)
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