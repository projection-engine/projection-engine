import CameraEffects from "../lib/CameraEffects"
import Engine from "../Engine"
import {glMatrix, vec3, vec4} from "gl-matrix"
import ConversionAPI from "../lib/math/ConversionAPI"

import GPUState from "../states/GPUState"
import StaticUBOState from "../states/StaticUBOState"
import CameraState from "../states/CameraState"
import CameraNotificationDecoder from "../lib/CameraNotificationDecoder"
import EngineState from "../states/EngineState";
import {Components, Environment,} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import CameraComponent from "@engine-core/lib/components/CameraComponent";

export default class CameraManager extends CameraState {
    static #dynamicAspectRatio = false
    static metadata = new CameraEffects()
    static #worker: Worker
    static #initialized = false

    static initialize() {
        if (CameraManager.#initialized)
            return
        CameraManager.#initialized = true
        CameraManager.#worker = new Worker("./camera-worker.js")
        CameraManager.projectionBuffer[4] = 10
        CameraNotificationDecoder.initialize(CameraManager.notificationBuffers)
        CameraManager.#worker.postMessage([
            CameraManager.notificationBuffers,
            CameraManager.position,
            CameraManager.viewMatrix,
            CameraManager.projectionMatrix,
            CameraManager.invViewMatrix,
            CameraManager.invProjectionMatrix,
            CameraManager.staticViewMatrix,
            CameraManager.translationBuffer,
            CameraManager.rotationBuffer,
            CameraManager.skyboxProjectionMatrix,
            CameraManager.invSkyboxProjectionMatrix,
            CameraManager.projectionBuffer,
            CameraManager.viewProjectionMatrix,
            CameraManager.viewUBOBuffer,
            CameraManager.projectionUBOBuffer
        ])
        new ResizeObserver(CameraManager.updateAspectRatio)
            .observe(GPUState.canvas)

    }

    static syncThreads() {
        CameraNotificationDecoder.elapsed = EngineState.elapsed
        CameraManager.#worker.postMessage(0)
    }

    static updateUBOs() {
        const entity = EngineState.cameraEntityTarget
        const transformation = EntityManager.getComponent<TransformationComponent>(entity, Components.TRANSFORMATION)
        if(!transformation){
            EngineState.cameraEntityTarget = undefined
        } else if (transformation.changesApplied) {
            CameraManager.update(transformation.translation, transformation.rotationQuaternionFinal)
        }

        if (CameraNotificationDecoder.hasChangedProjection === 1) {
            const UBO = StaticUBOState.cameraProjectionUBO

            UBO.bind()
            CameraManager.projectionUBOBuffer[32] = GPUState.bufferResolution[0]
            CameraManager.projectionUBOBuffer[33] = GPUState.bufferResolution[1]
            CameraManager.projectionUBOBuffer[34] = 2.0 / Math.log2(CameraManager.projectionBuffer[0] + 1)

            UBO.updateBuffer(CameraManager.projectionUBOBuffer)
            UBO.unbind()

            EngineState.visibilityNeedsUpdate = true
        }

        if (CameraNotificationDecoder.hasChangedView === 1) {
            const UBO = StaticUBOState.cameraViewUBO
            UBO.bind()
            UBO.updateBuffer(CameraManager.viewUBOBuffer)
            UBO.unbind()

            EngineState.visibilityNeedsUpdate = true
        }
    }

    static updateAspectRatio() {
        const bBox = GPUState.canvas.getBoundingClientRect()
        ConversionAPI.canvasBBox = bBox
        if (Engine.environment === Environment.DEV || CameraManager.#dynamicAspectRatio) {
            CameraManager.aspectRatio = bBox.width / bBox.height
            CameraManager.updateProjection()
        }
    }

    static update(translation, rotation) {
        if (translation != null)
            vec3.copy(CameraManager.translationBuffer, translation)
        if (rotation != null)
            vec4.copy(CameraManager.rotationBuffer, rotation)
        CameraNotificationDecoder.viewNeedsUpdate = 1
    }

    static serializeState(): CameraSerialization {

        return {
            translationSmoothing: CameraManager.translationSmoothing,
            metadata: {...CameraManager.dumpEffects()},
            rotation: [...CameraManager.rotationBuffer],
            translation: [...CameraManager.translationBuffer]
        }
    }

    static get hasChangedView() {
        return CameraNotificationDecoder.hasChangedView === 1
    }

    static get isOrthographic(): boolean {
        return CameraNotificationDecoder.projectionType === CameraNotificationDecoder.ORTHOGRAPHIC
    }

    static set isOrthographic(data) {
        CameraNotificationDecoder.projectionType = data ? CameraNotificationDecoder.ORTHOGRAPHIC : CameraNotificationDecoder.PERSPECTIVE
        CameraNotificationDecoder.projectionNeedsUpdate = 1
    }

    static set translationSmoothing(data) {
        CameraNotificationDecoder.translationSmoothing = data
    }

    static get translationSmoothing() {
        return CameraNotificationDecoder.translationSmoothing
    }


    static updateProjection() {
        CameraNotificationDecoder.projectionNeedsUpdate = 1
    }

    static updateView() {
        CameraNotificationDecoder.viewNeedsUpdate = 1
    }

    static restoreState(state: CameraSerialization) {
        const {rotation, translation, translationSmoothing, metadata} = state
        CameraManager.restoreMetadata(metadata)
        CameraManager.updateTranslation(translation)
        CameraManager.updateRotation(rotation)
        CameraManager.translationSmoothing = translationSmoothing

        CameraManager.updateView()
    }

    static updateViewTarget(data: EngineEntity | Object) {
        if (!data)
            EngineState.cameraEntityTarget = undefined

        let cameraObj
        if (typeof data === "string" && EntityManager.entityExists(data as EngineEntity) && EntityManager.hasComponent(data as EngineEntity, Components.CAMERA)) {
            EngineState.cameraEntityTarget = data as EngineEntity
            cameraObj = EntityManager.getComponent<CameraComponent>(data as EngineEntity, Components.CAMERA)
        } else if (typeof data === "object") {
            cameraObj = data
        } else
            return;

        cameraObj = {...cameraObj}

        EngineState.motionBlurEnabled = cameraObj.motionBlurEnabled === true || cameraObj.cameraMotionBlur === true
        EngineState.motionBlurVelocityScale = cameraObj.mbVelocityScale
        EngineState.motionBlurMaxSamples = cameraObj.mbSamples

        CameraManager.zFar = cameraObj.zFar
        CameraManager.zNear = cameraObj.zNear
        CameraManager.fov = cameraObj.fov < Math.PI * 2 ? cameraObj.fov : glMatrix.toRadian(cameraObj.fov)
        CameraManager.#dynamicAspectRatio = cameraObj.dynamicAspectRatio
        CameraManager.isOrthographic = cameraObj.ortho
        CameraManager.cameraMotionBlur = cameraObj.cameraMotionBlur
        CameraManager.vignetteEnabled = cameraObj.vignette
        CameraManager.vignetteStrength = cameraObj.vignetteStrength
        CameraManager.distortion = cameraObj.distortion
        CameraManager.distortionStrength = cameraObj.distortionStrength
        CameraManager.chromaticAberration = cameraObj.chromaticAberration
        CameraManager.chromaticAberrationStrength = cameraObj.chromaticAberrationStrength
        CameraManager.filmGrain = cameraObj.filmGrain
        CameraManager.filmGrainStrength = cameraObj.filmGrainStrength
        CameraManager.bloom = cameraObj.bloom
        CameraManager.bloomThreshold = cameraObj.bloomThreshold
        CameraManager.gamma = cameraObj.gamma
        CameraManager.exposure = cameraObj.exposure
        CameraManager.apertureDOF = cameraObj.apertureDOF
        CameraManager.focalLengthDOF = cameraObj.focalLengthDOF
        CameraManager.focusDistanceDOF = cameraObj.focusDistanceDOF
        CameraManager.samplesDOF = cameraObj.samplesDOF
        CameraManager.DOF = cameraObj.enabledDOF

        if (!cameraObj.dynamicAspectRatio && cameraObj.aspectRatio)
            CameraManager.aspectRatio = cameraObj.aspectRatio
        else
            CameraManager.updateAspectRatio()

        if (typeof data === "string") {
            const translation = EntityManager.getComponent<TransformationComponent>(data as EngineEntity, Components.TRANSFORMATION)
            CameraManager.update(translation.translation, translation.rotationQuaternionFinal)
        }
        CameraManager.updateProjection()
    }
}

