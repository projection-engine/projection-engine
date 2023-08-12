import {vec3, vec4} from "gl-matrix"
import CameraAPI from "../../../engine/core/lib/utils/CameraAPI"
import EditorCameraSystem from "../../../engine/tools/systems/EditorCameraSystem"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import EngineStateService from "./engine/EngineStateService"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/components/TransformationComponent";
import EntityManager from "@engine-core/EntityManager";


export default class ViewportActionUtil {
    static toCopy = []

    static copy(single?: boolean, target?: string) {
        const selected = EntitySelectionStore.getEntitiesSelected()
        if (target)
            ViewportActionUtil.toCopy = [target]
        else if (single && selected[0])
            ViewportActionUtil.toCopy = [selected[0]]
        else
            ViewportActionUtil.toCopy = [...selected]
    }

    static focus() {
        const transformComponent = EntityManager.getComponent<TransformationComponent>(EntitySelectionStore.getMainEntity(), Components.TRANSFORMATION)
        if (!transformComponent)
            return

        vec3.copy(CameraAPI.translationBuffer, transformComponent.absoluteTranslation)

        const position = <vec4>[0, 0, 5, 1]
        vec4.transformQuat(position, position, CameraAPI.rotationBuffer)
        vec3.add(CameraAPI.translationBuffer, CameraAPI.translationBuffer, <vec3>position)

        EditorCameraSystem.updateProperties({forceUpdate: true})
    }

    static deleteSelected() {
        EngineStateService.removeBlock(EntitySelectionStore.getEntitiesSelected())
    }

    static invertSelection() {
        const newArr = []
        const notValid: TypedObject<boolean> = {}
        const oldSelected = EntitySelectionStore.getEntitiesSelected()
        for (let i = 0; i < oldSelected.length; i++)
            notValid[oldSelected[i]] = true
        const entities: EngineEntity[] = EntityManager.getEntityIds()
        for (let i = 0; i < entities.length; i++) {
            if (!notValid[entities[i]])
                newArr.push(entities[i])
        }

        EntitySelectionStore.setEntitiesSelected(newArr)
    }

    static paste(parent?: EngineEntity) {
        const block = []
        if (!ViewportActionUtil.toCopy)
            return
        for (let i = 0; i < ViewportActionUtil.toCopy.length; i++) {
            const found = ViewportActionUtil.toCopy[i]
            if (parent === found)
                continue
            if (found) {
                // TODO - IMPLEMENT CLONE METHOD FOR EDITOR ENTITIES
                // const clone = found.clone()
                // block.push(clone)
                // if (!targetParent)
                //     continue
                // EntityManager.addParent(clone.id, targetParent.id)
            }
        }
        EngineStateService.appendBlock(block)
        ToastNotificationSystem.getInstance().log(`Pasted ${ViewportActionUtil.toCopy.length} entities.`)

    }

    static group() {
        const selected = EntitySelectionStore.getEntitiesSelected()
        ViewportActionUtil.toCopy = selected
        if (selected.length > 1)
            EngineStateService.linkMultiple(selected)
    }

    static selectAll() {
        EntitySelectionStore.setEntitiesSelected(EntityManager.getEntityIds())
    }

    static fixateActive() {
        const selected = EntitySelectionStore.getEntitiesSelected()
        if (selected[0])
            EntitySelectionStore.setLockedEntity(selected[0])
    }
}
