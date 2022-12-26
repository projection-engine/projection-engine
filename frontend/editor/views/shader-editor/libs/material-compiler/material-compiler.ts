import NODE_TYPES from "./templates/NODE_TYPES"
import cloneClass from "../../../../../../engine-core/utils/clone-class";
import compileFragmentShader from "./utils/compile-fragment-shader";
import MATERIAL_OUTPUT_FORMAT from "../../../../../../engine-core/static/MATERIAL_OUTPUT_FORMAT"
import MutableObject from "../../../../../../engine-core/MutableObject";
import ShaderLink from "../ShaderLink";

export default async function materialCompiler(n:MutableObject[], links:ShaderLink[]):Promise<MutableObject | undefined> {
    const nodes = <MutableObject[]>n.map(nn => cloneClass(nn))
    const startPoint = nodes.find(n => n.type === NODE_TYPES.OUTPUT)

    if (!startPoint) return
        const {
            functionDeclaration,
            uniformsDeclaration,
            uniforms,
            uniformValues
        } = await compileFragmentShader(startPoint, nodes, links)

        const template = {...MATERIAL_OUTPUT_FORMAT}
        template.functionDeclaration = functionDeclaration
        template.uniformsDeclaration = uniformsDeclaration

        template.settings.isSky = startPoint.isSky
        template.settings.doubleSided = startPoint.doubleSided
        template.settings.isAlphaTested = startPoint.alphaTested
        template.settings.ssrEnabled = startPoint.ssrEnabled

        template.uniforms = uniforms
        template.uniformValues = uniformValues
        return template

}