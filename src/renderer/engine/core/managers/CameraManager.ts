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

export default class CameraManager {
    static #dynamicAspectRatio = false
    static #worker: Worker
    static #initialized = false

    static initialize() {
        if (CameraManager.#initialized)
            return
        CameraManager.#initialized = true
        CameraManager.#worker = new Worker("./camera-worker.js")
        CameraState.projectionBuffer[4] = 10
        CameraNotificationDecoder.initialize(CameraState.notificationBuffers)
        CameraManager.#worker.postMessage([
            CameraState.notificationBuffers,
            CameraState.position,
            CameraState.viewMatrix,
            CameraState.projectionMatrix,
            CameraState.invViewMatrix,
            CameraState.invProjectionMatrix,
            CameraState.staticViewMatrix,
            CameraState.translationBuffer,
            CameraState.rotationBuffer,
            CameraState.skyboxProjectionMatrix,
            CameraState.invSkyboxProjectionMatrix,
            CameraState.projectionBuffer,
            CameraState.viewProjectionMatrix,
            CameraState.viewUBOBuffer,
            CameraState.projectionUBOBuffer
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
            CameraState.projectionUBOBuffer[32] = GPUState.bufferResolution[0]
            CameraState.projectionUBOBuffer[33] = GPUState.bufferResolution[1]
            CameraState.projectionUBOBuffer[34] = 2.0 / Math.log2(CameraState.projectionBuffer[0] + 1)

            UBO.updateBuffer(CameraState.projectionUBOBuffer)
            UBO.unbind()

            EngineState.visibilityNeedsUpdate = true
        }

        if (CameraNotificationDecoder.hasChangedView === 1) {
            const UBO = StaticUBOState.cameraViewUBO
            UBO.bind()
            UBO.updateBuffer(CameraState.viewUBOBuffer)
            UBO.unbind()

            EngineState.visibilityNeedsUpdate = true
        }
    }

    static updateAspectRatio() {
        const bBox = GPUState.canvas.getBoundingClientRect()
        ConversionAPI.canvasBBox = bBox
        if (Engine.environment === Environment.DEV || CameraManager.#dynamicAspectRatio) {
            CameraState.aspectRatio = bBox.width / bBox.height
            CameraManager.updateProjection()
        }
    }

    static update(translation, rotation) {
        if (translation != null)
            vec3.copy(CameraState.translationBuffer, translation)
        if (rotation != null)
            vec4.copy(CameraState.rotationBuffer, rotation)
        CameraNotificationDecoder.viewNeedsUpdate = 1
    }

    static serializeState(): CameraSerialization {

        return {
            translationSmoothing: CameraManager.translationSmoothing,
            metadata: {...CameraState.dumpEffects()},
            rotation: [...CameraState.rotationBuffer],
            translation: [...CameraState.translationBuffer]
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
        CameraState.restoreMetadata(metadata)
        CameraState.updateTranslation(translation)
        CameraState.updateRotation(rotation)
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

        CameraState.zFar = cameraObj.zFar
        CameraState.zNear = cameraObj.zNear
        CameraState.fov = cameraObj.fov < Math.PI * 2 ? cameraObj.fov : glMatrix.toRadian(cameraObj.fov)
        CameraManager.#dynamicAspectRatio = cameraObj.dynamicAspectRatio
        CameraManager.isOrthographic = cameraObj.ortho
        CameraState.cameraMotionBlur = cameraObj.cameraMotionBlur
        CameraState.vignetteEnabled = cameraObj.vignette
        CameraState.vignetteStrength = cameraObj.vignetteStrength
        CameraState.distortion = cameraObj.distortion
        CameraState.distortionStrength = cameraObj.distortionStrength
        CameraState.chromaticAberration = cameraObj.chromaticAberration
        CameraState.chromaticAberrationStrength = cameraObj.chromaticAberrationStrength
        CameraState.filmGrain = cameraObj.filmGrain
        CameraState.filmGrainStrength = cameraObj.filmGrainStrength
        CameraState.bloom = cameraObj.bloom
        CameraState.bloomThreshold = cameraObj.bloomThreshold
        CameraState.gamma = cameraObj.gamma
        CameraState.exposure = cameraObj.exposure
        CameraState.apertureDOF = cameraObj.apertureDOF
        CameraState.focalLengthDOF = cameraObj.focalLengthDOF
        CameraState.focusDistanceDOF = cameraObj.focusDistanceDOF
        CameraState.samplesDOF = cameraObj.samplesDOF
        CameraState.DOF = cameraObj.enabledDOF

        if (!cameraObj.dynamicAspectRatio && cameraObj.aspectRatio)
            CameraState.aspectRatio = cameraObj.aspectRatio
        else
            CameraManager.updateAspectRatio()

        if (typeof data === "string") {
            const translation = EntityManager.getComponent<TransformationComponent>(data as EngineEntity, Components.TRANSFORMATION)
            CameraManager.update(translation.translation, translation.rotationQuaternionFinal)
        }
        CameraManager.updateProjection()
    }
}

