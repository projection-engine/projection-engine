import NODE_TYPES from "./templates/NODE_TYPES"
import cloneClass from "../../../../../public/engine/utils/clone-class";
import compileFragmentShader from "./utils/compile-fragment-shader";
import MATERIAL_OUTPUT_FORMAT from "../../../../../public/engine/static/MATERIAL_OUTPUT_FORMAT.json"

export default async function materialCompiler(n, links) {
    const nodes = n.map(nn => cloneClass(nn))
    const startPoint = nodes.find(n => n.type === NODE_TYPES.OUTPUT)

    if (startPoint) {
        const {
            functionDeclaration,
            uniformsDeclaration,
            uniforms,
            uniformValues
        } = await compileFragmentShader(startPoint, nodes, links)

        const template = {...MATERIAL_OUTPUT_FORMAT}
        template.functionDeclaration = functionDeclaration
        template.uniformsDeclaration = uniformsDeclaration
        template.settings.cullFace = startPoint.faceCulling ? 0 : -1
        template.settings.noDepthTest = !startPoint.depthTest
        template.settings.isAlphaTested = startPoint.alphaTested
        template.uniforms = uniforms
        template.uniformsData = uniformValues
        return template
    } else return {}
}