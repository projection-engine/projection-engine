import GPU from "../GPU"
import applyShaderMethods from "../utils/apply-shader-methods"
import StaticUBOState, {StaticUBONames} from "../states/StaticUBOState"
import GPUUtil from "../utils/GPUUtil";
import {GLSLTypes} from "@engine-core/engine.enum";

const regex = /uniform(\s+)(highp|mediump|lowp)?(\s*)((\w|_)+)((\s|\w|_)*);/gm
const structRegex = (type) => {
	return new RegExp(`(struct\\s+${type}\\s*\\s*{.+?(?<=}))`, "gs")
}
const defineRegex = (global) => {
	return new RegExp("#define(\\s+)((\\w|_)+)(\\s+)(.+)", global ? "gmi" : "mi")
}
const regexMatch = /uniform(\s+)(highp|mediump|lowp)?(\s*)((\w|_)+)((\s|\w|_)*);$/m
const regexArray = (global) => {
	return new RegExp("uniform(\\s+)(highp|mediump|lowp)?(\\s*)((\\w|_)+)((\\s|\\w|_)*)\\[(\\w+)\\](\\s*);$", global ? "gm" : "m")
}

interface Uniform {
    type: string,
    name: string,
    parent?: string,
    arraySize?: number,
    uLocations?: WebGLUniformLocation[],
    uLocation?: WebGLUniformLocation
}

export default class Shader {
	program?: WebGLProgram
	uniforms = []
	uniformMap: TypedObject<WebGLUniformLocation> = {}
	length = 0
	messages = {
		error: undefined,
		messages: undefined,
		hasError: false
	}
	txt
	constructor(vertex, fragment) {
		const alert = []
		this.program = GPU.context.createProgram()

		const vertexBuilt = "#version 300 es\n" + applyShaderMethods(vertex)
		const fragmentBuilt = "#version 300 es\n" + applyShaderMethods(fragment)

		this.txt = fragmentBuilt
		const vertexShader = this.#compileShader(vertexBuilt, GPU.context.VERTEX_SHADER, m => alert.push(m))
		const fragmentShader = this.#compileShader(fragmentBuilt, GPU.context.FRAGMENT_SHADER, m => alert.push(m))

		GPU.context.attachShader(this.program, vertexShader)
		GPU.context.attachShader(this.program, fragmentShader)

		GPU.context.linkProgram(this.program)


		GPU.context.flush()
		this.#extractUniforms(vertexBuilt)
		this.#extractUniforms(fragmentBuilt)
		this.uniforms = this.uniforms.filter(u => u !== undefined && typeof u.uLocation === "object" || typeof u.uLocations === "object")

		for (let i = 0; i < this.uniforms.length; i++)
			this.uniformMap[this.uniforms[i].name] = this.uniforms[i].uLocation || this.uniforms[i].uLocations
		this.messages = {
			error: GPU.context.getError(),
			messages: alert,
			hasError: alert.length > 0
		}

		this.length = this.uniforms.length

		if (fragmentBuilt.includes(StaticUBONames.CAMERA_VIEW) || vertexBuilt.includes(StaticUBONames.CAMERA_VIEW))
			StaticUBOState.cameraViewUBO.bindWithShader(this.program)
		if (fragmentBuilt.includes(StaticUBONames.CAMERA_PROJECTION) || vertexBuilt.includes(StaticUBONames.CAMERA_PROJECTION))
			StaticUBOState.cameraProjectionUBO.bindWithShader(this.program)

		if (fragmentBuilt.includes(StaticUBONames.FRAME_COMPOSITION) || vertexBuilt.includes(StaticUBONames.FRAME_COMPOSITION))
			StaticUBOState.frameCompositionUBO.bindWithShader(this.program)

		if (fragmentBuilt.includes(StaticUBONames.LENS_PP) || vertexBuilt.includes(StaticUBONames.LENS_PP))
			StaticUBOState.lensPostProcessingUBO.bindWithShader(this.program)

		if (fragmentBuilt.includes(StaticUBONames.SSAO) || vertexBuilt.includes(StaticUBONames.SSAO))
			StaticUBOState.ssaoUBO.bindWithShader(this.program)

		if (fragmentBuilt.includes(StaticUBONames.UBER) || vertexBuilt.includes(StaticUBONames.UBER))
			StaticUBOState.uberUBO.bindWithShader(this.program)

		if (fragmentBuilt.includes(StaticUBONames.LIGHTS) || vertexBuilt.includes(StaticUBONames.LIGHTS))
			StaticUBOState.lightsUBO.bindWithShader(this.program)
	}

	#compileShader(shaderCode, shaderType, pushMessage) {


		const shader = GPU.context.createShader(shaderType)
		GPU.context.shaderSource(shader, shaderCode)
		GPU.context.compileShader(shader)
		const compiled = GPU.context.getShaderParameter(shader, GPU.context.COMPILE_STATUS)

		if (!compiled) {
			const error = GPU.context.getShaderInfoLog(shader)
			console.error({error, shaderCode})
			pushMessage(error)
		}
		return shader
	}


	#extractUniforms(code: string) {
		const uniforms = code.match(regex)
		if (uniforms)
			uniforms.forEach(u => {
				const match: string[] | number = u.match(regexMatch)
				if (match === null)
					return []
				const type = match[4]
				const name: string = match[6].replace(" ", "").trim()

				if (GLSLTypes[type] != null) {
					this.uniforms.push({
						type,
						name,
						uLocation: GPU.context.getUniformLocation(this.program, name)
					})
					return
				}

				const struct: string[] | number = code.match(structRegex(type))
				const reg = /^(\s*)(\w+)(\s*)((\w|_)+)/m
				if (struct === null)
					return []
				const partial: string[] = struct[0].split("\n").filter(e => Object.keys(GLSLTypes).some(v => e.includes(v)))
				this.uniforms.push(
					...partial.map((s): Uniform | undefined => {
						const current = s.match(reg)
						if (current) {
							return {
								type: current[2],
								name: current[4],
								parent: name,
								uLocation: GPU.context.getUniformLocation(this.program, name + "." + current[4])
							}
						}
					})
				)
			})
		const arrayUniforms = code.match(regexArray(true))
		const definitions = code.match(defineRegex(true))
		if (arrayUniforms)
			arrayUniforms.forEach(u => {
				const match = u.match(regexArray(false))

				if (!match)
					return
				const type = match[4]
				const name = match[6].replace(" ", "")
				const define = definitions.find(d => d.includes(match[8]))?.match(defineRegex(false))

				if (!define) return
				const arraySize = parseInt(define[5])
				if (GLSLTypes[type] !== undefined) {
					this.uniforms.push({
						type,
						name,
						arraySize,
						uLocations: (new Array(arraySize).fill(null)).map((_, i) => GPU.context.getUniformLocation(this.program, name + `[${i}]`))
					})
					return
				}
				const struct = code.match(structRegex(type))
				const reg = /^(\s*)(\w+)(\s*)((\w|_)+)/m

				if (!struct)
					return
				const partial = struct[0].split("\n").filter(e => Object.keys(GLSLTypes).some(v => e.includes(v)))
				this.uniforms.push(
					...partial.map((s): Uniform | undefined => {
						const current: string[] | null = s.match(reg)
						if (current === null)
							return
						return {
							type: current[2],
							name: current[4],
							parent: name,
							arraySize,
							uLocations: (new Array(arraySize).fill(null)).map((_, i) => GPU.context.getUniformLocation(this.program, name + `[${i}]` + "." + current[4]))
						}
					})
				)
			})

	}

	bind() {
		if (GPU.activeShader !== this) {
			GPU.context.useProgram(this.program)
			GPU.activeShader = this
		}
	}

	bindForUse(data: MutableObject) {
		this.bind()
		let currentSamplerIndex = 0
		const increase = () => currentSamplerIndex++
		for (let v = 0; v < this.length; v++) {
			const current = this.uniforms[v]
			if (current.uLocations != null) {
				const dataAttr = current.parent !== undefined ? data[current.parent] : data[current.name]
				if (!dataAttr)
					continue
				for (let i = 0; i < current.uLocations.length; i++) {
					const u = current.uLocations[i]
					const d = dataAttr[i]
					if (current.parent)
						Shader.bind(u, d[current.name], current.type, currentSamplerIndex, increase)
					else
						Shader.bind(u, d, current.type, currentSamplerIndex, increase)
				}
			} else {
				const dataAttribute = current.parent !== undefined ? data[current.parent][current.name] : data[current.name]
				Shader.bind(current.uLocation, dataAttribute, current.type, currentSamplerIndex, increase)
			}
		}

	}

	static bind(uLocation:WebGLUniformLocation, data, type: GLSLTypes, currentSamplerIndex: number, increaseIndex: VoidFunction) {

		if (data == null)
			return
		switch (type) {
		case GLSLTypes.float:
		case GLSLTypes.vec3:
		case GLSLTypes.vec2:
		case GLSLTypes.vec4:
		case GLSLTypes.ivec2:
		case GLSLTypes.ivec3:
		case GLSLTypes.bool:
			GPU.context[GLSLTypes[type]](uLocation, data)
			break
		case GLSLTypes.mat3:
			GPU.context.uniformMatrix3fv(uLocation, false, data)
			break
		case GLSLTypes.mat4:
			GPU.context.uniformMatrix4fv(uLocation, false, data)
			break
		case GLSLTypes.samplerCube:
			GPU.context.activeTexture(GPU.context.TEXTURE0 + currentSamplerIndex)
			GPU.context.bindTexture(GPU.context.TEXTURE_CUBE_MAP, data)
			GPU.context.uniform1i(uLocation, currentSamplerIndex)
			increaseIndex()
			break
		case GLSLTypes.sampler2D:
			GPUUtil.bind2DTextureForDrawing(uLocation, currentSamplerIndex, data)
			increaseIndex()
			break
		default:
			break
		}

	}


}
