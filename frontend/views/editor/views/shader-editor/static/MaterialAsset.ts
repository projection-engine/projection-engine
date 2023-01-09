import MutableObject from "../../../../../../engine-core/MutableObject"
import MaterialUniform from "../../../../../../engine-core/templates/MaterialUniform";

interface Settings{
    isAlphaTested:boolean
    ssrEnabled:boolean
    isSky:boolean
    doubleSided:boolean
    flatShading: boolean
}
export default interface MaterialAsset {

    functionDeclaration: string
    uniformsDeclaration: string
    settings: Settings
    uniforms: MutableObject[]
    uniformValues: MaterialUniform[]
}