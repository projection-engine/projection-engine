import NODE_TYPES from "./templates/NODE_TYPES"
import cloneClass from "../../../../../../../engine-core/utils/clone-class";
import compileFragmentShader from "./utils/compile-fragment-shader";
import MATERIAL_OUTPUT_FORMAT from "../../../../../../../engine-core/static/MATERIAL_OUTPUT_FORMAT"
import type ShaderLink from "../../templates/ShaderLink";
import type ShaderNode from "../../templates/ShaderNode";
import MaterialUniform from "../../../../../../../engine-core/templates/MaterialUniform";
import Material from "../../templates/nodes/Material";
import MaterialInformation from "../../../../../../../engine-core/templates/MaterialInformation";

export default async function materialCompiler(n:ShaderNode[], links:ShaderLink[]):Promise<[MaterialInformation, string] | undefined> {
    const nodes = n.map(nn => cloneClass<ShaderNode>(nn))
    const startPoint = <Material>nodes.find(n => n.type === NODE_TYPES.OUTPUT)

    const executionSignature = {signature: ""}
    if (!startPoint) return

    const {
        functionDeclaration,
        uniformsDeclaration,
        uniforms,
        uniformValues
    } = await compileFragmentShader(startPoint, nodes, links, executionSignature)

    const template = {...MATERIAL_OUTPUT_FORMAT}
    template.functionDeclaration = functionDeclaration
    template.uniformsDeclaration = uniformsDeclaration

    template.settings.renderingMode = startPoint.renderingMode
    console.trace(startPoint.renderingMode)
    template.settings.doubleSided = startPoint.doubleSided
    template.settings.ssrEnabled = startPoint.ssrEnabled

    template.uniforms = uniforms
    template.executionSignature = executionSignature.signature
    template.uniformValues = <MaterialUniform[]>uniformValues
    return [template, executionSignature.signature]

}