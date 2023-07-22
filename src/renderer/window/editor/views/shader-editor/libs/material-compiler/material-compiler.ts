import NODE_TYPES from "./templates/NODE_TYPES"
import cloneClass from "../../../../../../engine/core/utils/clone-class"
import compileFragmentShader from "./utils/compile-fragment-shader"
import MATERIAL_OUTPUT_FORMAT from "../../../../../../engine/core/static/MATERIAL_OUTPUT_FORMAT"
import type ShaderLink from "../../templates/ShaderLink"
import type ShaderNode from "../../templates/ShaderNode"
import MaterialUniform from "../../../../../../engine/core/static/MaterialUniform"
import type Material from "../../templates/nodes/Material"
import MaterialInformation from "../../../../../../engine/core/static/MaterialInformation"

function hash(str:string):number {
	let hash = 0, i, chr
	if (str.length === 0) return hash
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = ((hash << 5) - hash) + chr
		hash |= 0
	}
	return hash
}

export default async function materialCompiler(n:ShaderNode[], links:ShaderLink[]):Promise<[MaterialInformation, string] | undefined> {
	const nodes = n.map(nn => cloneClass<ShaderNode>(nn))
	const startPoint = <Material>nodes.find(n => n.type === NODE_TYPES.OUTPUT)


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

	template.settings.renderingMode = startPoint.renderingMode

	template.settings.doubleSided = startPoint.doubleSided
	template.settings.ssrEnabled = startPoint.ssrEnabled

	template.uniforms = uniforms
	template.executionSignature = `${hash(functionDeclaration)}`
	template.uniformValues = <MaterialUniform[]>uniformValues
	return [template, template.executionSignature]

}