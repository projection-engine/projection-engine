import EngineStore from "../stores/EngineStore";
import {v4} from "uuid";
import UndoRedoAPI from "./UndoRedoAPI";
import HierarchyController from "./HierarchyController";
import QueryAPI from "../../public/engine/lib/apis/utils/QueryAPI";
import EntityAPI from "../../public/engine/lib/apis/EntityAPI";
import Engine from "../../public/engine/Engine";

export default class ActionHistoryAPI {
    static targets = {
        entity: 1,
        block: 2,
        groupTransformations: 3
    }
    static #cb = () => null

    static initializeListener(cb) {
        ActionHistoryAPI.#cb = cb
    }

    static controller = new UndoRedoAPI()

    static clear() {
        ActionHistoryAPI.controller.index = 0
        ActionHistoryAPI.controller.history = [null]
    }

    static pushChange({target, entityID, component, key, changeValue}) {
        let value
        if (typeof changeValue === "object")
            value = structuredClone(changeValue)
        else value = changeValue
        ActionHistoryAPI.controller.save({
            target,
            entityID,
            component,
            key,
            changeValue: value
        })
    }

    static pushGroupChange(changesMap) {
        ActionHistoryAPI.controller.save({
            changesMap,
            target: ActionHistoryAPI.targets.groupTransformations
        })
    }

    static saveEntity(entityID, component, key, changeValue) {
        ActionHistoryAPI.pushChange({
            target: ActionHistoryAPI.targets.entity,
            changeValue,
            entityID,
            component,
            key
        })
    }

    static pushBlockChange(original) {
        ActionHistoryAPI.controller.save({
            target: ActionHistoryAPI.targets.block,
            currentSet: original
        })
    }

    static undo() {
        ActionHistoryAPI.#cb("UNDO")
        const hasToApply = ActionHistoryAPI.controller.undo()
        if (hasToApply)
            ActionHistoryAPI.#apply()
    }

    static redo() {
        ActionHistoryAPI.#cb("REDO")
        const hasToApply = ActionHistoryAPI.controller.redo()
        if (hasToApply)
            ActionHistoryAPI.#apply()
    }

    static #apply() {
        const currentAction = ActionHistoryAPI.controller.history[ActionHistoryAPI.controller.index]
        if (!currentAction)
            return
        const targets = ActionHistoryAPI.targets
        switch (currentAction.target) {
            case targets.entity: {
                const entity = QueryAPI.getEntityByID(currentAction.entityID)
                if (currentAction.component != null) {
                    if (typeof currentAction.component === "number" && entity.scripts[currentAction.component])
                        entity.scripts[currentAction.component][currentAction.key] = currentAction.changeValue
                    else
                        entity.components.get(currentAction.component)[currentAction.key] = currentAction.changeValue
                } else {
                    const value = entity[currentAction.key]
                    if (Array.isArray(value)) {
                        for (let i = 0; i < currentAction.changeValue.length; i++)
                            value[i] = currentAction.changeValue[i]
                    } else
                        entity[currentAction.key] = currentAction.changeValue
                    entity.changed = true
                }
                EngineStore.updateStore()
                break
            }
            case targets.groupTransformations: {
                const entities = [], toApply = currentAction.changesMap

                for (let i = 0; i < toApply.length; i++) {
                    const change = toApply[i]
                    const entity = QueryAPI.getEntityByID(change.id)

                    if (!entity)
                        continue
                    entities.push(entity)
                    const value = entity[change.key]
                    for (let j = 0; j < change.value.length; j++)
                        value[j] = change.value[j]
                    if (change.key === "pivotPoint")
                        entity.__pivotChanged = true

                }
                entities.forEach(e => e.changed = true)
                break
            }
            case targets.block:
                const newEntities = currentAction.currentSet
                const oldEntities = [...Engine.entities]
                for (let i = 0; i < newEntities.length; i++) {
                    const e = newEntities[i]
                    if (QueryAPI.getEntityByID(e.id) != null)
                        continue
                    if (e.parent && !e.parent.children.includes(e))
                        EntityAPI.linkEntities(e, e.parent)

                    EntityAPI.addEntity(e)
                }
                for (let i = 0; i < oldEntities.length; i++) {
                    const e = oldEntities[i]
                    if (newEntities.includes(e))
                        continue
                    EntityAPI.removeEntity(e.id)
                }
                HierarchyController.updateHierarchy()
                EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
                break
            default:
                break
        }
    }
}

