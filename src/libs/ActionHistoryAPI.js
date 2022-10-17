import EngineStore from "../stores/EngineStore";
import {v4} from "uuid";
import UndoRedoAPI from "./UndoRedoAPI";
import {Engine, EntityAPI} from "../../public/engine/production";
import HierarchyController from "./HierarchyController";
import QueryAPI from "../../public/engine/production/apis/utils/QueryAPI";

export default class ActionHistoryAPI {
    static targets = {
        entity: "ENTITY",
        block: "BLOCK",
        entities: "ENTITIES"
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

    static pushGroupChange(entities, changeValue, key, component) {
        ActionHistoryAPI.controller.save({
            entities,
            changeValue,
            key,
            component,
            target: ActionHistoryAPI.targets.entities
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
            case targets.entities: {
                const entities = [], toApply = currentAction.entities
                for (let i = 0; i < toApply.length; i++) {
                    const entity = QueryAPI.getEntityByID(toApply[i])
                    if (!entity)
                        continue
                    entities.push(entity)
                    const value = entity[currentAction.key]
                    for (let j = 0; j < value.length; j++)
                        value[i] = currentAction.changeValue[i][j]
                }
                console.log(entities)
                entities.forEach(e => e.changed = true)
                EngineStore.updateStore()
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

