import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import EngineStore from "../stores/EngineStore";

import SelectionStore from "../stores/SelectionStore";

import QueryAPI from "../../public/engine/api/utils/QueryAPI";
import {vec3, vec4} from "gl-matrix";
import CameraAPI from "../../public/engine/api/CameraAPI";
import CameraTracker from "../../public/engine/editor-environment/libs/CameraTracker";
import Engine from "../../public/engine/Engine";


export default class ViewportActions {
    static toCopy = []

    static copy(single, target) {
        const selected = SelectionStore.engineSelected
        if (target)
            ViewportActions.toCopy = [target]
        else if (single && selected[0])
            ViewportActions.toCopy = [selected[0]]
        else
            ViewportActions.toCopy = [...selected]
    }

    static focus() {

        const entity = QueryAPI.getEntityByID(SelectionStore.mainEntity)

        if (!entity)
            return

        vec3.copy(CameraAPI.translationBuffer, entity._translation)

        const position = [0,0, 10,1]
        vec4.transformQuat(position, position, CameraAPI.rotationBuffer)
        vec3.add(CameraAPI.translationBuffer, CameraAPI.translationBuffer, position)

        CameraTracker.forceUpdate = true
    }

    static deleteSelected() {
        dispatchRendererEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: [...SelectionStore.engineSelected]
        })
    }

    static invertSelection() {
        const newArr = []
        const notValid = {}
        const oldSelected = SelectionStore.engineSelected
        for (let i = 0; i < oldSelected.length; i++)
            notValid[oldSelected[i]] = true
        const entities = Engine.entities
        for (let i = 0; i < entities.length; i++) {
            if (!notValid[entities[i].id])
                newArr.push(entities[i].id)
        }

        SelectionStore.engineSelected = newArr
    }

    static paste(parent) {
        let block = []
        if (!ViewportActions.toCopy)
            return
        const targetParent = parent ? QueryAPI.getEntityByID(parent) : undefined
        for (let i = 0; i < ViewportActions.toCopy.length; i++) {
            const t = ViewportActions.toCopy[i]
            const found = QueryAPI.getEntityByID(t)
            if (found) {
                if (targetParent === found)
                    continue
                const clone = found.clone()
                block.push(clone)
                if (!targetParent)
                    continue
                clone.parent = targetParent
                targetParent.children.push(clone)
            }
        }
        dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        alert.pushAlert(`Pasted ${ViewportActions.toCopy.length} entities.`, "info")

    }

    static group() {
        const selected = SelectionStore.engineSelected
        ViewportActions.toCopy = selected
        if (selected.length > 1)
            dispatchRendererEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: selected
            })
    }

    static selectAll() {
        SelectionStore.engineSelected = Array.from(Engine.entitiesMap.keys())
    }

    static fixateActive() {
        const selected = SelectionStore.engineSelected
        if (selected[0])
            EngineStore.updateStore({...EngineStore.engine, lockedEntity: selected[0]})
    }
}