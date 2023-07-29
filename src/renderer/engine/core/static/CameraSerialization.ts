import CameraEffectsSerialization from "./CameraEffectsSerialization"

interface CameraSerialization {
    translationSmoothing: number,
    metadata: CameraEffectsSerialization,
    rotation: number[],
    translation: number[],
    prevX?:number,
    prevY?:number
}

export default CameraSerialization
