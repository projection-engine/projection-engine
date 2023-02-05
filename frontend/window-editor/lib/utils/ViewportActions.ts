import EngineStore from "../../../shared/stores/EngineStore";

import SelectionStore from "../../../shared/stores/SelectionStore";

import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
import {vec3, vec4} from "gl-matrix";
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
import Engine from "../../../../engine-core/Engine";
import AlertController from "../../../shared/components/alert/AlertController";
import EntityManager from "../EntityManager";


export default class ViewportActions {
    static toCopy = []

    static copy(single?: boolean, target?: string) {
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

        vec3.copy(CameraAPI.translationBuffer, entity.absoluteTranslation)

        const position = <vec4>[0, 0, 5, 1]
        vec4.transformQuat(position, position, CameraAPI.rotationBuffer)
        vec3.add(CameraAPI.translationBuffer, CameraAPI.translationBuffer, <vec3>position)

        CameraTracker.forceUpdate = true
    }

    static deleteSelected() {
        EntityManager.removeBlock(SelectionStore.engineSelected)
    }

    static invertSelection() {
        const newArr = []
        const notValid = {}
        const oldSelected = <string[]>SelectionStore.engineSelected
        for (let i = 0; i < oldSelected.length; i++)
            notValid[oldSelected[i]] = true
        const entities = Engine.entities.array
        for (let i = 0; i < entities.length; i++) {
            if (!notValid[entities[i].id])
                newArr.push(entities[i].id)
        }

        SelectionStore.engineSelected = newArr
    }

    static paste(parent?: string) {
        const block = []
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
                clone.addParent(targetParent)
            }
        }
        EntityManager.appendBlock(block)
        AlertController.log(`Pasted ${ViewportActions.toCopy.length} entities.`)

    }

    static group() {
        const selected = SelectionStore.engineSelected
        ViewportActions.toCopy = selected
        if (selected.length > 1)
            EntityManager.linkMultiple(selected)
    }

    static selectAll() {
        SelectionStore.engineSelected = Array.from(Engine.entities.map.keys())
    }

    static fixateActive() {
        const selected = SelectionStore.engineSelected
        if (selected[0])
            EngineStore.updateStore({...EngineStore.engine, lockedEntity: selected[0]})
    }
}