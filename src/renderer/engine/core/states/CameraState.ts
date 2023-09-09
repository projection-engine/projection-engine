import {quat, vec3} from "gl-matrix"
import ArrayBufferUtil from "@engine-core/utils/ArrayBufferUtil"
import CameraNotificationDecoder from "@engine-core/lib/CameraNotificationDecoder"
import StaticUBOState from "@engine-core/states/StaticUBOState";


/**
 * @field notificationBuffers {float32array [viewNeedsUpdate, projectionNeedsUpdate, isOrthographic, hasChanged, translationSmoothing,  elapsed]}
 * @field transformationBuffer {float32array [translation.x, translation.y, translation.z, rotation.x, rotation.y, rotation.z, rotation.w]}
 * @field projectionBuffer {float32array [zFar, zNear, fov, aR, orthographicSize]}
 */

const U_INT = new Uint8Array(1)
const FLOAT = new Float32Array(1)
export default class CameraState {
    static position = ArrayBufferUtil.allocateVector(3) as Float32Array
    static viewMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static projectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static invViewMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static invProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static viewProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static previousViewProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static staticViewMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static skyboxProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static invSkyboxProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
    static viewUBOBuffer = ArrayBufferUtil.allocateVector(52)
    static projectionUBOBuffer = ArrayBufferUtil.allocateVector(35)
    static projectionBuffer = ArrayBufferUtil.allocateVector(5)
    static translationBuffer = <vec3>ArrayBufferUtil.allocateVector(3)
    static rotationBuffer = <quat>ArrayBufferUtil.allocateVector(4, 0, true)
    static notificationBuffers = CameraNotificationDecoder.generateBuffer()
    static cameraMotionBlur = false
    static #bloom = false
    static #filmGrain = false
    static #vignetteEnabled = false
    static #chromaticAberration = false
    static #distortion = false
    static DOF = false
    static size = 50
    static #focusDistanceDOF = 10
    static #apertureDOF = 1.2
    static #focalLengthDOF = 5
    static #samplesDOF = 100
    static #filmGrainStrength = 1.
    static #vignetteStrength = .25
    static bloomThreshold = .75
    static bloomQuality = 8
    static bloomOffset = 0
    static #gamma = 2.2
    static #exposure = 1.
    static #chromaticAberrationStrength = 1
    static #distortionStrength = 1


    static addTranslation(data: number[] | Float32Array) {
        const T = CameraState.translationBuffer
        T[0] = T[0] + data[0] || 0
        T[1] = T[1] + data[1] || 0
        T[2] = T[2] + data[2] || 0
    }

    static updateTranslation(data: number[] | Float32Array) {
        const T = CameraState.translationBuffer
        T[0] = data[0] || 0
        T[1] = data[1] || 0
        T[2] = data[2] || 0
    }

    static updateRotation(data: number[] | Float32Array) {
        const R = CameraState.rotationBuffer

        R[0] = data[0] || 0
        R[1] = data[1] || 0
        R[2] = data[2] || 0
        R[3] = data[3] || 0
    }


    static get zFar() {
        return CameraState.projectionBuffer[0]
    }

    static get zNear() {
        return CameraState.projectionBuffer[1]
    }

    static get fov() {
        return CameraState.projectionBuffer[2]
    }

    static get aspectRatio() {
        return CameraState.projectionBuffer[3]
    }

    static get orthographicProjectionSize() {
        return CameraState.projectionBuffer[4]
    }

    static set zFar(data) {
        CameraState.projectionBuffer[0] = data
    }

    static set zNear(data) {
        CameraState.projectionBuffer[1] = data
    }

    static set fov(data) {
        CameraState.projectionBuffer[2] = data
    }

    static set aspectRatio(data) {
        CameraState.projectionBuffer[3] = data
    }

    static set orthographicProjectionSize(data) {
        CameraState.projectionBuffer[4] = data
    }


    static restoreMetadata(data: CameraEffectsSerialization) {
        CameraState.DOF = data.DOF
        CameraState.bloom = data.bloom
        CameraState.filmGrain = data.filmGrain
        CameraState.vignetteEnabled = data.vignetteEnabled
        CameraState.chromaticAberration = data.chromaticAberration
        CameraState.distortion = data.distortion
        CameraState.cameraMotionBlur = data.cameraMotionBlur
        CameraState.zNear = data.zNear
        CameraState.zFar = data.zFar
        CameraState.fov = data.fov
        CameraState.aspectRatio = data.aspectRatio
        CameraState.size = data.size
        CameraState.focusDistanceDOF = data.focusDistanceDOF
        CameraState.apertureDOF = data.apertureDOF
        CameraState.focalLengthDOF = data.focalLengthDOF
        CameraState.samplesDOF = data.samplesDOF
        CameraState.filmGrainStrength = data.filmGrainStrength
        CameraState.vignetteStrength = data.vignetteStrength
        CameraState.bloomThreshold = data.bloomThreshold
        CameraState.bloomQuality = data.bloomQuality
        CameraState.bloomOffset = data.bloomOffset
        CameraState.gamma = data.gamma
        CameraState.exposure = data.exposure
        CameraState.chromaticAberrationStrength = data.chromaticAberrationStrength
        CameraState.distortionStrength = data.distortionStrength
    }

    static dumpEffects(): CameraEffectsSerialization {
        return {
            zNear: CameraState.zNear,
            zFar: CameraState.zFar,
            fov: CameraState.fov,
            aspectRatio: CameraState.aspectRatio,
            size: CameraState.size,
            focusDistanceDOF: CameraState.#focusDistanceDOF,
            apertureDOF: CameraState.#apertureDOF,
            focalLengthDOF: CameraState.#focalLengthDOF,
            samplesDOF: CameraState.#samplesDOF,
            filmGrainStrength: CameraState.#filmGrainStrength,
            vignetteStrength: CameraState.#vignetteStrength,
            bloomThreshold: CameraState.bloomThreshold,
            bloomQuality: CameraState.bloomQuality,
            bloomOffset: CameraState.bloomOffset,
            gamma: CameraState.#gamma,
            exposure: CameraState.#exposure,
            chromaticAberrationStrength: CameraState.#chromaticAberrationStrength,
            distortionStrength: CameraState.#distortionStrength,
            cameraMotionBlur: CameraState.cameraMotionBlur,
            DOF: CameraState.DOF,
            bloom: CameraState.#bloom,
            filmGrain: CameraState.#filmGrain,
            vignetteEnabled: CameraState.#vignetteEnabled,
            chromaticAberration: CameraState.#chromaticAberration,
            distortion: CameraState.#distortion,
        }
    }

    // EFFECTS
    static get vignetteStrength() {
        return CameraState.#vignetteStrength
    }


    static get vignetteEnabled() {
        return CameraState.#vignetteEnabled
    }


    static get filmGrain() {
        return CameraState.#filmGrain
    }

    static get filmGrainStrength() {
        return CameraState.#filmGrainStrength
    }


    static get gamma() {
        return CameraState.#gamma
    }

    static get exposure() {
        return CameraState.#exposure
    }

    static get focusDistanceDOF() {
        return CameraState.#focusDistanceDOF
    }


    static get apertureDOF() {
        return CameraState.#apertureDOF
    }


    static get focalLengthDOF() {
        return CameraState.#focalLengthDOF
    }

    static get distortionStrength() {
        return CameraState.#distortionStrength
    }

    static get chromaticAberrationStrength() {
        return CameraState.#chromaticAberrationStrength
    }

    static get bloom() {
        return CameraState.#bloom
    }

    static get chromaticAberration() {
        return CameraState.#chromaticAberration
    }

    static get distortion() {
        return CameraState.#distortion
    }

    static get samplesDOF() {
        return CameraState.#samplesDOF
    }


    static set focalLengthDOF(data) {
        CameraState.#focalLengthDOF = data
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = data
        StaticUBOState.lensPostProcessingUBO.updateData("focalLengthDOF", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }

    static set apertureDOF(data) {
        CameraState.#apertureDOF = data
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = data
        StaticUBOState.lensPostProcessingUBO.updateData("apertureDOF", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }

    static set focusDistanceDOF(data) {
        CameraState.#focusDistanceDOF = data
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = data
        StaticUBOState.lensPostProcessingUBO.updateData("focusDistanceDOF", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }

    static set vignetteStrength(data) {
        CameraState.#vignetteStrength = data
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = data
        StaticUBOState.lensPostProcessingUBO.updateData("vignetteStrength", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }

    static set vignetteEnabled(data) {
        CameraState.#vignetteEnabled = data
        StaticUBOState.lensPostProcessingUBO.bind()
        U_INT[0] = data ? 1 : 0
        StaticUBOState.lensPostProcessingUBO.updateData("vignetteEnabled", U_INT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }

    static set filmGrain(data) {
        CameraState.#filmGrain = data
        FLOAT[0] = data ? 1 : 0
        StaticUBOState.frameCompositionUBO.bind()
        StaticUBOState.frameCompositionUBO.updateData("filmGrainEnabled", FLOAT)
        StaticUBOState.frameCompositionUBO.unbind()
    }

    static set filmGrainStrength(data) {
        CameraState.#filmGrainStrength = data
        StaticUBOState.frameCompositionUBO.bind()
        FLOAT[0] = data
        StaticUBOState.frameCompositionUBO.updateData("filmGrainStrength", FLOAT)
        StaticUBOState.frameCompositionUBO.unbind()
    }


    static set samplesDOF(data) {
        CameraState.#samplesDOF = data
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = data
        StaticUBOState.lensPostProcessingUBO.updateData("samplesDOF", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }


    static set gamma(data) {
        CameraState.#gamma = data
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = data
        StaticUBOState.lensPostProcessingUBO.updateData("gamma", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }

    static set exposure(data) {
        CameraState.#exposure = data
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = data
        StaticUBOState.lensPostProcessingUBO.updateData("exposure", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }


    static set distortion(v) {
        CameraState.#distortion = v
        StaticUBOState.lensPostProcessingUBO.bind()
        U_INT[0] = v ? 1 : 0
        StaticUBOState.lensPostProcessingUBO.updateData("distortionEnabled", U_INT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }


    static set chromaticAberration(v) {
        CameraState.#chromaticAberration = v
        StaticUBOState.lensPostProcessingUBO.bind()
        U_INT[0] = v ? 1 : 0
        StaticUBOState.lensPostProcessingUBO.updateData("chromaticAberrationEnabled", U_INT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }


    static set bloom(v) {
        CameraState.#bloom = v
        StaticUBOState.lensPostProcessingUBO.bind()
        U_INT[0] = v ? 1 : 0
        StaticUBOState.lensPostProcessingUBO.updateData("bloomEnabled", U_INT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }


    static set chromaticAberrationStrength(v) {
        CameraState.#chromaticAberrationStrength = v
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = v
        StaticUBOState.lensPostProcessingUBO.updateData("chromaticAberrationIntensity", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }


    static set distortionStrength(v) {
        CameraState.#distortionStrength = v
        StaticUBOState.lensPostProcessingUBO.bind()
        FLOAT[0] = v
        StaticUBOState.lensPostProcessingUBO.updateData("distortionIntensity", FLOAT)
        StaticUBOState.lensPostProcessingUBO.unbind()
    }
}

