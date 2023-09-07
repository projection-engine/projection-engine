import GPUState from "../states/GPUState"
import CameraManager from "../managers/CameraManager"
import TransformationManager from "../managers/TransformationManager"
import {mat4} from "gl-matrix"
import StaticShadersState from "../states/StaticShadersState"
import StaticFBOState from "../states/StaticFBOState"
import StaticMeshesState from "../states/StaticMeshesState"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import MetricsManager from "../managers/MetricsManager"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import loopMeshes from "./loop-meshes"
import Mesh from "@engine-core/lib/resources/Mesh"
import AbstractSystem from "../AbstractSystem";
import EngineState from "../states/EngineState";
import Material from "@engine-core/lib/resources/Material";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import {Components} from "@engine-core/engine.enum";
import CullingComponent from "@engine-core/lib/components/CullingComponent";
import SpriteComponent from "@engine-core/lib/components/SpriteComponent";
import EntityManager from "@engine-core/managers/EntityManager";

const entityMetadata = new Float32Array(16)
let context: WebGL2RenderingContext, uniforms, VP
export default class VisibilityRendererSystem extends AbstractSystem {
    #isSecondPass = false

    #bindUniforms() {
        uniforms = StaticShadersState.visibilityUniforms
        VP = CameraManager.cameraMotionBlur ? CameraManager.previousViewProjectionMatrix : CameraManager.viewProjectionMatrix
        context.uniformMatrix4fv(uniforms.viewProjection, false, CameraManager.viewProjectionMatrix)
        context.uniformMatrix4fv(uniforms.previousViewProjection, false, VP)
        context.uniformMatrix4fv(uniforms.viewMatrix, false, CameraManager.viewMatrix)
        context.uniform3fv(uniforms.cameraPlacement, CameraManager.position)
        mat4.copy(CameraManager.previousViewProjectionMatrix, CameraManager.viewProjectionMatrix)
    }

    #drawSprites() {
        const toRender = EntityManager.withComponent(Components.SPRITE).array
        const size = toRender.length
        if (size === 0)
            return
        entityMetadata[5] = 1 // IS SPRITE
        context.disable(context.CULL_FACE)
        for (let i = 0; i < size; i++) {
            const entity = toRender[i]
            const components = EntityManager.getAllComponentsMap(entity)
            const culling = components.get(Components.CULLING) as CullingComponent
            const sprite = components.get(Components.SPRITE) as SpriteComponent
            const transform = components.get(Components.TRANSFORMATION) as TransformationComponent
            if (!transform || culling.isDistanceCulled || !EntityManager.isEntityEnabled(entity) || culling?.isScreenDoorEnabled)
                continue
            const pId = EntityManager.getEntityPickVec3(entity)
            entityMetadata[0] = pId[0]
            entityMetadata[1] = pId[1]
            entityMetadata[2] = pId[2]

            entityMetadata[4] = 0

            entityMetadata[8] = sprite.attributes[0]
            entityMetadata[9] = sprite.attributes[1]

            entityMetadata[12] = transform.scaling[0]
            entityMetadata[13] = transform.scaling[1]
            entityMetadata[14] = transform.scaling[2]

            context.uniformMatrix4fv(uniforms.metadata, false, entityMetadata)
            context.uniformMatrix4fv(uniforms.modelMatrix, false, transform.matrix)
            context.uniformMatrix4fv(uniforms.previousModelMatrix, false, transform.previousModelMatrix)

            StaticMeshesState.drawQuad()
        }
        context.enable(context.CULL_FACE)
    }


     shouldExecute = (): boolean =>  {
        return EngineState.visibilityNeedsUpdate || TransformationManager.hasChangeBuffer[0] !== 0;
    }

     execute = () => {
        context = GPUState.context
        if (!this.#isSecondPass) {
            this.#isSecondPass = true
            EngineState.visibilityNeedsUpdate = true
        } else {
            EngineState.visibilityNeedsUpdate = false
            this.#isSecondPass = false
        }

        StaticShadersState.visibility.bind()
        StaticFBOState.visibility.startMapping()
        this.#bindUniforms()
        entityMetadata[5] = 0
        loopMeshes(this.#loop)

        this.#drawSprites()
        StaticFBOState.visibility.stopMapping()
        MetricsManager.currentState = METRICS_FLAGS.VISIBILITY

        EngineState.shouldAOExecute = true
    }

    #loop(entity: EngineEntity, mesh: Mesh, material: Material, transformComponent: TransformationComponent, cullingComponent: CullingComponent) {

        const hasScreenDoor = cullingComponent?.isScreenDoorEnabled
        const pId = EntityManager.getEntityPickVec3(entity)
        entityMetadata[0] = pId[0]
        entityMetadata[1] = pId[1]
        entityMetadata[2] = pId[2]
        entityMetadata[4] = hasScreenDoor || material?.renderingMode === MATERIAL_RENDERING_TYPES.TRANSPARENCY ? 1 : 0

        context.uniformMatrix4fv(uniforms.metadata, false, entityMetadata)
        context.uniformMatrix4fv(uniforms.modelMatrix, false, transformComponent.matrix)
        if (EngineState.motionBlurEnabled)
            context.uniformMatrix4fv(uniforms.previousModelMatrix, false, transformComponent.previousModelMatrix)

        mesh.simplifiedDraw()
    }
}
