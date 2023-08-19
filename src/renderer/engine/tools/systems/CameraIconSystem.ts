import StaticEditorMeshes from "../utils/StaticEditorMeshes"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import GPUState from "@engine-core/states/GPUState"
import {mat4} from "gl-matrix"
import EditorEntity from "../EditorEntity"
import EngineToolsState from "../EngineToolsState"
import AbstractSystem from "../../core/AbstractSystem";
import GPUUtil from "../../core/utils/GPUUtil";
import StaticFBOState from "@engine-core/states/StaticFBOState";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EditorEntityManager from "../EditorEntityManager";
import CullingComponent from "@engine-core/lib/components/CullingComponent";
import EntityManager from "@engine-core/managers/EntityManager";

export default class CameraIconSystem extends AbstractSystem {
    static #invView = mat4.create()
    static #projection = mat4.create()
    static #view = mat4.create()

    #createFrustumMatrix(entity: EditorEntity) {
        const transform = entity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
        if (transform.changesApplied || !entity.__cameraIconMatrix) {
            const t = transform.translation
            const q = transform.rotationQuaternion


            mat4.perspective(CameraIconSystem.#projection, Math.PI / 4, 1.3, .5, 3)
            if (!entity.__cameraIconMatrix)
                entity.__cameraIconMatrix = mat4.create()
            mat4.fromRotationTranslation(CameraIconSystem.#invView, q, t)
            mat4.invert(CameraIconSystem.#view, CameraIconSystem.#invView)
            mat4.multiply(entity.__cameraIconMatrix, CameraIconSystem.#projection, CameraIconSystem.#view)
            mat4.invert(entity.__cameraIconMatrix, entity.__cameraIconMatrix)
        }
    }

    shouldExecute(): boolean {
        return EntityManager.withComponent(Components.CAMERA).size > 0;
    }

    execute() {
        const uniforms = StaticEditorShaders.wireframeUniforms
        const arr = EntityManager.withComponent(Components.CAMERA).array
        const context = GPUState.context
        const size = arr.length
        StaticEditorShaders.wireframe.bind()
        GPUUtil.bind2DTextureForDrawing(uniforms.depth, 0, StaticFBOState.sceneDepthVelocity)
        for (let i = 0; i < size; i++) {
            const entity = EditorEntityManager.getEntity(arr[i])
            const cullingComp = entity.getComponent<CullingComponent>(Components.CULLING)

            if (cullingComp && cullingComp.distanceFromCamera > EngineToolsState.maxDistanceIcon)
                continue
            this.#createFrustumMatrix(entity)

            context.uniform1i(uniforms.isSelected, entity.__isSelected ? 1 : 0)
            context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.__cameraIconMatrix)
            StaticEditorMeshes.clipSpaceCamera.drawLines()
        }
    }
}
