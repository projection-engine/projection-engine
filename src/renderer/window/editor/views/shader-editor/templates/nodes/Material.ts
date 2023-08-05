import ShaderNode from "../ShaderNode"
import NODE_TYPES from "../../libs/material-compiler/templates/NODE_TYPES"
import MATERIAL_RENDERING_TYPES from "../../../../../../engine/core/static/MATERIAL_RENDERING_TYPES"
import Signature from "../Signature"
import ShaderEditorUtil from "../../../../util/ShaderEditorUtil"
import {MaterialDataTypes,} from "@engine-core/engine.enum";

function arrayToGlsl(a) {
	const arr = Array.isArray(a) ? a : [0, 0, 0]
	return "vec3(" + arr.map(a => ShaderEditorUtil.checkGlslFloat(parseFloat(a.toFixed(4)))) + ")"
}

export default class Material extends ShaderNode implements Signature{
	static signature = "Material"
	getSignature():string{
		return Material.signature
	}
	doubleSided = false
	ssrEnabled = false

	refraction = 0
	roughness = 1
	metallic = 0
	opacity = 1
	emission = [0, 0, 0]
	al = [0, 0, 0]

	renderingMode = MATERIAL_RENDERING_TYPES.ISOTROPIC
	anisotropicRotation = 0
	anisotropy = 0
	clearCoat = 0
	sheen = 0
	sheenTint = 0

	static #updateInput(key: string, value: any, instance: Material) {
		instance.inputs.find(i => i.key === key).disabled = value
	}

	constructor() {
		const allTypes = [MaterialDataTypes.VEC4, MaterialDataTypes.VEC3, MaterialDataTypes.VEC2, MaterialDataTypes.FLOAT, MaterialDataTypes.INT]
		super([
			{label: "Albedo", key: "al", accept: allTypes, type: MaterialDataTypes.COLOR},
			{label: "Normal", key: "normal", accept: allTypes},
			{label: "Ambient Occlusion", key: "ao", accept: allTypes},
			{label: "Roughness", key: "roughness", accept: allTypes, type: MaterialDataTypes.FLOAT, max: 1, min: 0},
			{label: "Metallic", key: "metallic", accept: allTypes, type: MaterialDataTypes.FLOAT, max: 1, min: 0},
			{label: "Emission", key: "emission", accept: allTypes, type: MaterialDataTypes.COLOR},
			{
				label: "Opacity",
				key: "opacity",
				accept: allTypes,
				disabled: true,
				type: MaterialDataTypes.FLOAT,
				max: 1,
				min: 0
			},
			{label: "Refraction index", key: "refraction", accept: allTypes, type: MaterialDataTypes.FLOAT, disabled: true},

			{label: "Anisotropic rotation", key: "anisotropicRotation", accept: allTypes, type: MaterialDataTypes.FLOAT},
			{label: "Anisotropy", key: "anisotropy", accept: allTypes, type: MaterialDataTypes.FLOAT},

			{label: "Clear coat", key: "clearCoat", accept: allTypes, type: MaterialDataTypes.FLOAT},

			{label: "Sheen", key: "sheen", accept: allTypes, type: MaterialDataTypes.FLOAT},
			{label: "Sheen tint", key: "sheenTint", accept: allTypes, type: MaterialDataTypes.FLOAT},

			{label: "Screen-space reflections", key: "ssrEnabled", type: MaterialDataTypes.CHECKBOX},
			{label: "Double sided", key: "doubleSided", type: MaterialDataTypes.CHECKBOX},
			{
				label: "Rendering type",
				key: "renderingMode",
				type: MaterialDataTypes.OPTIONS,
				options: [
					{label: "Isotropic", data: MATERIAL_RENDERING_TYPES.ISOTROPIC},
					{label: "Anisotropic", data: MATERIAL_RENDERING_TYPES.ANISOTROPIC},
					{label: "Sky", data: MATERIAL_RENDERING_TYPES.SKY},
					{label: "Transparency", data: MATERIAL_RENDERING_TYPES.TRANSPARENCY},
					{label: "Clear-Coat", data: MATERIAL_RENDERING_TYPES.CLEAR_COAT},
					{label: "Sheen", data: MATERIAL_RENDERING_TYPES.SHEEN},
					{label: "Unlit", data: MATERIAL_RENDERING_TYPES.UNLIT},
				]
			},


		], [])

		const rT = this.inputs.find(i => i.key === "renderingMode")
		rT.onChange = (newValue: number) => {
			switch (newValue) {
			case MATERIAL_RENDERING_TYPES.ISOTROPIC:
				Material.#updateInput("al", false, this)
				Material.#updateInput("normal", false, this)
				Material.#updateInput("ao", false, this)
				Material.#updateInput("roughness", false, this)
				Material.#updateInput("metallic", false, this)
				Material.#updateInput("emission", false, this)
				Material.#updateInput("opacity", true, this)
				Material.#updateInput("ssrEnabled", false, this)
				Material.#updateInput("doubleSided", false, this)
				Material.#updateInput("refraction", true, this)
				Material.#updateInput("anisotropicRotation", true, this)
				Material.#updateInput("anisotropy", true, this)
				Material.#updateInput("clearCoat", true, this)
				Material.#updateInput("sheen", true, this)
				Material.#updateInput("sheenTint", true, this)
				break
			case MATERIAL_RENDERING_TYPES.ANISOTROPIC:
				Material.#updateInput("al", false, this)
				Material.#updateInput("normal", false, this)
				Material.#updateInput("ao", false, this)
				Material.#updateInput("roughness", false, this)
				Material.#updateInput("metallic", false, this)
				Material.#updateInput("emission", false, this)
				Material.#updateInput("opacity", true, this)
				Material.#updateInput("ssrEnabled", false, this)
				Material.#updateInput("doubleSided", false, this)
				Material.#updateInput("refraction", true, this)
				Material.#updateInput("anisotropicRotation", false, this)
				Material.#updateInput("anisotropy", false, this)
				Material.#updateInput("clearCoat", true, this)
				Material.#updateInput("sheen", true, this)
				Material.#updateInput("sheenTint", true, this)
				break
			case MATERIAL_RENDERING_TYPES.SKY:
				Material.#updateInput("al", false, this)
				Material.#updateInput("normal", true, this)
				Material.#updateInput("ao", true, this)
				Material.#updateInput("roughness", true, this)
				Material.#updateInput("metallic", true, this)
				Material.#updateInput("emission", true, this)
				Material.#updateInput("opacity", true, this)
				Material.#updateInput("ssrEnabled", true, this)
				Material.#updateInput("doubleSided", true, this)
				Material.#updateInput("refraction", true, this)
				Material.#updateInput("anisotropicRotation", true, this)
				Material.#updateInput("anisotropy", true, this)
				Material.#updateInput("clearCoat", true, this)
				Material.#updateInput("sheen", true, this)
				Material.#updateInput("sheenTint", true, this)
				break
			case MATERIAL_RENDERING_TYPES.TRANSPARENCY:
				Material.#updateInput("al", false, this)
				Material.#updateInput("normal", false, this)
				Material.#updateInput("ao", true, this)
				Material.#updateInput("roughness", false, this)
				Material.#updateInput("metallic", true, this)
				Material.#updateInput("emission", false, this)
				Material.#updateInput("opacity", false, this)
				Material.#updateInput("ssrEnabled", false, this)
				Material.#updateInput("doubleSided", true, this)
				Material.#updateInput("refraction", false, this)
				Material.#updateInput("anisotropicRotation", true, this)
				Material.#updateInput("anisotropy", true, this)
				Material.#updateInput("clearCoat", true, this)
				Material.#updateInput("sheen", true, this)
				Material.#updateInput("sheenTint", true, this)
				break
			case MATERIAL_RENDERING_TYPES.CLEAR_COAT:
				Material.#updateInput("al", false, this)
				Material.#updateInput("normal", false, this)
				Material.#updateInput("ao", false, this)
				Material.#updateInput("roughness", false, this)
				Material.#updateInput("metallic", false, this)
				Material.#updateInput("emission", false, this)
				Material.#updateInput("opacity", true, this)
				Material.#updateInput("ssrEnabled", false, this)
				Material.#updateInput("doubleSided", false, this)
				Material.#updateInput("refraction", true, this)
				Material.#updateInput("anisotropicRotation", true, this)
				Material.#updateInput("anisotropy", true, this)
				Material.#updateInput("clearCoat", false, this)
				Material.#updateInput("sheen", true, this)
				Material.#updateInput("sheenTint", true, this)
				break
			case MATERIAL_RENDERING_TYPES.SHEEN:
				Material.#updateInput("al", false, this)
				Material.#updateInput("normal", false, this)
				Material.#updateInput("ao", false, this)
				Material.#updateInput("roughness", false, this)
				Material.#updateInput("metallic", false, this)
				Material.#updateInput("emission", false, this)
				Material.#updateInput("opacity", true, this)
				Material.#updateInput("ssrEnabled", false, this)
				Material.#updateInput("doubleSided", false, this)
				Material.#updateInput("refraction", true, this)
				Material.#updateInput("anisotropicRotation", true, this)
				Material.#updateInput("anisotropy", true, this)
				Material.#updateInput("clearCoat", true, this)
				Material.#updateInput("sheen", false, this)
				Material.#updateInput("sheenTint", false, this)
				break
			case MATERIAL_RENDERING_TYPES.UNLIT:
				Material.#updateInput("al", false, this)
				Material.#updateInput("normal", true, this)
				Material.#updateInput("ao", true, this)
				Material.#updateInput("roughness", true, this)
				Material.#updateInput("metallic", true, this)
				Material.#updateInput("emission", true, this)
				Material.#updateInput("opacity", true, this)
				Material.#updateInput("ssrEnabled", true, this)
				Material.#updateInput("doubleSided", false, this)
				Material.#updateInput("refraction", true, this)
				Material.#updateInput("anisotropicRotation", true, this)
				Material.#updateInput("anisotropy", true, this)
				Material.#updateInput("clearCoat", true, this)
				Material.#updateInput("sheen", true, this)
				Material.#updateInput("sheenTint", true, this)
				break
			}
		}
		rT.onChange(this.renderingMode)
		this.name = "Material"
	}

	get type() {
		return NODE_TYPES.OUTPUT
	}

	getData(field) {
		switch (field.type) {
		case MaterialDataTypes.VEC2:
			return `vec3(${field.name}, 0.)`
		case MaterialDataTypes.VEC4:
			return `vec3(${field.name})`
		case MaterialDataTypes.FLOAT:
			return `vec3(${field.name}, ${field.name}, ${field.name})`
		case MaterialDataTypes.INT:
			return `vec3(float(${field.name}), float(${field.name}), float(${field.name}))`
		default:
			return field.name
		}
	}

	static getDataBehaviour(field) {
		switch (field.type) {
		case MaterialDataTypes.VEC2:
		case MaterialDataTypes.VEC4:
		case MaterialDataTypes.VEC3:
			return `${field.name}.x`
		case MaterialDataTypes.INT:
			return `float(${field.name})`

		default:
			return field.name
		}
	}


	getFunctionCall({
		al = {
			name: arrayToGlsl(this.al),
			type: MaterialDataTypes.VEC3
		},
		normal,
		ao = {
			name: ShaderEditorUtil.checkGlslFloat(1),
			type: MaterialDataTypes.FLOAT
		},
		roughness = {
			name: ShaderEditorUtil.checkGlslFloat(this.roughness),
			type: MaterialDataTypes.FLOAT
		},
		metallic = {
			name: ShaderEditorUtil.checkGlslFloat(this.metallic),
			type: MaterialDataTypes.FLOAT
		},
		opacity = {
			name: ShaderEditorUtil.checkGlslFloat(this.opacity),
			type: MaterialDataTypes.FLOAT
		},
		emission = {
			name: arrayToGlsl(this.emission),
			type: MaterialDataTypes.VEC3
		},

		refraction = {
			name: ShaderEditorUtil.checkGlslFloat(this.refraction),
			type: MaterialDataTypes.FLOAT
		},
		anisotropicRotation = {
			name: ShaderEditorUtil.checkGlslFloat(this.anisotropicRotation),
			type: MaterialDataTypes.FLOAT
		},
		anisotropy = {
			name: ShaderEditorUtil.checkGlslFloat(this.anisotropy),
			type: MaterialDataTypes.FLOAT
		},
		clearCoat = {
			name: ShaderEditorUtil.checkGlslFloat(this.clearCoat),
			type: MaterialDataTypes.FLOAT
		},

		sheen = {
			name: ShaderEditorUtil.checkGlslFloat(this.sheen),
			type: MaterialDataTypes.FLOAT
		},
		sheenTint = {
			name: ShaderEditorUtil.checkGlslFloat(this.sheenTint),
			type: MaterialDataTypes.FLOAT
		},

	}) {

		return ` 
            naturalAO = clamp(${Material.getDataBehaviour(ao)}, 0., 1.);
            roughness = clamp(${Material.getDataBehaviour(roughness)}, 0., 1.);
            metallic = clamp(${Material.getDataBehaviour(metallic)}, 0., 1.);
            refractionIndex = ${Material.getDataBehaviour(refraction)};
            
            anisotropicRotation = ${Material.getDataBehaviour(anisotropicRotation)};
            anisotropy          = ${Material.getDataBehaviour(anisotropy)};
            clearCoat           = ${Material.getDataBehaviour(clearCoat)};
            sheen               = ${Material.getDataBehaviour(sheen)};
            sheenTint           = ${Material.getDataBehaviour(sheenTint)};
            
            alpha = clamp(${this.renderingMode === MATERIAL_RENDERING_TYPES.TRANSPARENCY ? Material.getDataBehaviour(opacity) : "1."}, 0., 1.);
            albedo = abs(${this.getData(al)});
            ${normal ? "computeTBN();" : ""}
            N = ${normal ? `normalize(TBN * ((${this.getData(normal)} * 2.0)- 1.0))` : "normalVec"};
            emission = abs(${this.getData(emission)}); 
        `
	}
}

