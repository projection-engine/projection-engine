import StaticEditorMeshes from "../state/StaticEditorMeshes"
import {vec3} from "gl-matrix"
import GizmoUtil from "../utils/GizmoUtil"
import AbstractXYZGizmo from "./AbstractXYZGizmo";
import GizmoManager from "../managers/GizmoManager";
import GizmoState from "../state/GizmoState";

export default class TranslationGizmo extends AbstractXYZGizmo {
    constructor() {
        super()
        this.mesh = StaticEditorMeshes.translationGizmo
        this.xGizmo = TranslationGizmo.#mapGizmoMesh("x", 2)
        this.yGizmo = TranslationGizmo.#mapGizmoMesh("y", 3)
        this.zGizmo = TranslationGizmo.#mapGizmoMesh("z", 4)
    }

    static #mapGizmoMesh(axis: string, index: number) {
        const rotation = vec3.create()
        const scale = vec3.fromValues(.75, 0.05, 0.05)
        switch (axis) {
            case "y":
                vec3.copy(rotation, [0, 0, Math.PI / 2])
                break
            case "z":
                vec3.copy(rotation, [Math.PI, -Math.PI / 2, Math.PI])
                break
        }
        return GizmoUtil.getGizmoEntity(index, rotation, scale)
    }

    clearState() {
        GizmoManager.setHasCloned(false)
    }

    onMouseMove(event: MouseEvent) {
        const vec = GizmoUtil.mapToScreenMovement(event.clientX, event.clientY, true)
        GizmoManager.translate(vec, event.ctrlKey, event.altKey, event.shiftKey)
        GizmoState.callListeners()
    }
}
