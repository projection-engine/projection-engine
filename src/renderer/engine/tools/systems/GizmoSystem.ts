import GPUState from "@engine-core/states/GPUState"
import GizmoUtil from "../gizmo/util/GizmoUtil"
import GizmoState from "../gizmo/util/GizmoState"
import DynamicMap from "@engine-core/lib/DynamicMap"
import AbstractSystem from "../../core/AbstractSystem";


export default class GizmoSystem extends AbstractSystem {
    static onStart?: Function
    static onStop?: Function
    static #listeners = new DynamicMap<string, Function>()

    static addListener(id: string, callback: Function) {
        GizmoSystem.#listeners.set(id, callback)
    }

    static removeListener(id: string) {
        GizmoSystem.#listeners.delete(id)
    }

    static callListeners(updateTransformation = true) {
        if (updateTransformation)
            GizmoUtil.updateGizmosTransformation()
        const arr = GizmoSystem.#listeners.array
        for (let i = 0; i < arr.length; i++) {
            arr[i]()
        }
    }

    shouldExecute(): boolean {
        const m = GizmoState.mainEntity
        return m != null && m.active
    }

    execute() {
        const context = GPUState.context
        context.clear(context.DEPTH_BUFFER_BIT)
        GizmoUtil.createTransformationCache(GizmoState.mainEntity)
        const targetGizmosSize = GizmoState.targetGizmos.length
        GizmoUtil.drawGizmoToDepth()
        for (let i = 0; i < targetGizmosSize; i++) {
            GizmoState.targetGizmos[i].drawGizmo()
        }
    }
}
