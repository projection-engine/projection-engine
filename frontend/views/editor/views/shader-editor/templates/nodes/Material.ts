import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../libs/material-compiler/templates/NODE_TYPES"
import checkGlslFloat from "../../utils/check-glsl-float";
import MATERIAL_RENDERING_TYPES from "../../../../../../../engine-core/static/MATERIAL_RENDERING_TYPES";


function arrayToGlsl(a) {
    const arr = Array.isArray(a) ? a : [0, 0, 0]
    return "vec3(" + arr.map(a => checkGlslFloat(parseFloat(a.toFixed(4)))) + ")"
}

export default class Material extends ShaderNode {
    canBeDeleted = false
    doubleSided = false
    ssrEnabled = false

    refraction = 0
    roughness = 1
    metallic = 0
    opacity = 1
    emission = [0, 0, 0]
    al = [0, 0, 0]
    flatShading = false

    renderingType = MATERIAL_RENDERING_TYPES.ISOTROPIC
    anisotropicRotation = 0
    anisotropy = 0
    clearCoat = 0
    sheen = 0
    sheenTint = 0

    static #updateInput(key: String, value: any, instance: Material) {
        instance.inputs.find(i => i.key === key).disabled = value
    }

    constructor() {
        const allTypes = [DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2, DATA_TYPES.FLOAT, DATA_TYPES.INT]
        super([
            {label: "Albedo", key: "al", accept: allTypes, type: DATA_TYPES.COLOR},
            {label: "Normal", key: "normal", accept: allTypes},
            {label: "Ambient Occlusion", key: "ao", accept: allTypes},
            {label: "Roughness", key: "roughness", accept: allTypes, type: DATA_TYPES.FLOAT, max: 1, min: 0},
            {label: "Metallic", key: "metallic", accept: allTypes, type: DATA_TYPES.FLOAT, max: 1, min: 0},
            {label: "Emission", key: "emission", accept: allTypes, type: DATA_TYPES.COLOR},
            {
                label: "Opacity",
                key: "opacity",
                accept: allTypes,
                disabled: true,
                type: DATA_TYPES.FLOAT,
                max: 1,
                min: 0
            },
            {label: "Screen-space reflections", key: "ssrEnabled", type: DATA_TYPES.CHECKBOX},
            {label: "Double sided", key: "doubleSided", type: DATA_TYPES.CHECKBOX},
            {
                label: "Rendering type",
                key: "renderingType",
                type: DATA_TYPES.OPTIONS,
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

            {label: "Refraction index", key: "refraction", accept: allTypes, type: DATA_TYPES.FLOAT, disabled: true},

            {label: "Anisotropic rotation", key: "anisotropicRotation", type: DATA_TYPES.FLOAT},
            {label: "Anisotropy", key: "anisotropy", type: DATA_TYPES.FLOAT},

            {label: "Clear coat", key: "clearCoat", type: DATA_TYPES.FLOAT},

            {label: "Sheen", key: "sheen", type: DATA_TYPES.FLOAT},
            {label: "Sheen tint", key: "sheenTint", type: DATA_TYPES.FLOAT},
        ], [])

        const rT = this.inputs.find(i => i.key === "renderingType")
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
                    Material.#updateInput("ssrEnabled", true, this)
                    Material.#updateInput("doubleSided", true, this)
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
                    Material.#updateInput("doubleSided", true, this)
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
                    Material.#updateInput("doubleSided", true, this)
                    Material.#updateInput("refraction", true, this)
                    Material.#updateInput("anisotropicRotation", true, this)
                    Material.#updateInput("anisotropy", true, this)
                    Material.#updateInput("clearCoat", true, this)
                    Material.#updateInput("sheen", true, this)
                    Material.#updateInput("sheenTint", true, this)
                    break
            }
        }
        this.name = "Material"
    }

    get type() {
        return NODE_TYPES.OUTPUT
    }

    getData(field) {
        switch (field.type) {
            case DATA_TYPES.VEC2:
                return `vec3(${field.name}, 0.)`
            case DATA_TYPES.VEC4:
                return `vec3(${field.name})`
            case DATA_TYPES.FLOAT:
                return `vec3(${field.name}, ${field.name}, ${field.name})`
            case DATA_TYPES.INT:
                return `vec3(float(${field.name}), float(${field.name}), float(${field.name}))`
            default:
                return field.name
        }
    }

    getDataBehaviour(field) {

        switch (field.type) {
            case DATA_TYPES.VEC2:
            case DATA_TYPES.VEC4:
            case DATA_TYPES.VEC3:
                return `${field.name}.x`
            case DATA_TYPES.INT:
                return `float(${field.name})`
            default:
                return field.name
        }
    }


    getFunctionCall({
                        al = {
                            name: arrayToGlsl(this.al),
                            type: DATA_TYPES.VEC3
                        },
                        normal,
                        ao = {
                            name: checkGlslFloat(1),
                            type: DATA_TYPES.FLOAT
                        },
                        roughness = {
                            name: checkGlslFloat(this.roughness),
                            type: DATA_TYPES.FLOAT
                        },
                        metallic = {
                            name: checkGlslFloat(this.metallic),
                            type: DATA_TYPES.FLOAT
                        },
                        opacity = {
                            name: checkGlslFloat(this.opacity),
                            type: DATA_TYPES.FLOAT
                        },
                        emission = {
                            name: arrayToGlsl(this.emission),
                            type: DATA_TYPES.VEC3
                        },

                        refraction = {
                            name: checkGlslFloat(this.refraction),
                            type: DATA_TYPES.FLOAT
                        },
                        anisotropicRotation = {
                            name: checkGlslFloat(this.anisotropicRotation),
                            type: DATA_TYPES.FLOAT
                        },
                        anisotropy = {
                            name: checkGlslFloat(this.anisotropy),
                            type: DATA_TYPES.FLOAT
                        },
                        clearCoat = {
                            name: checkGlslFloat(this.clearCoat),
                            type: DATA_TYPES.FLOAT
                        },

                        sheen = {
                            name: checkGlslFloat(this.sheen),
                            type: DATA_TYPES.FLOAT
                        },
                        sheenTint = {
                            name: checkGlslFloat(this.sheenTint),
                            type: DATA_TYPES.FLOAT
                        },

                    }) {

        return ` 
            naturalAO = ${this.getDataBehaviour(ao)};
            roughness = ${this.getDataBehaviour(roughness)};
            metallic = ${this.getDataBehaviour(metallic)};
            refractionIndex = ${this.getDataBehaviour(refraction)};
            
            anisotropicRotation = ${this.getDataBehaviour(anisotropicRotation)};
            anisotropy          = ${this.getDataBehaviour(anisotropy)};
            clearCoat           = ${this.getDataBehaviour(clearCoat)};
            sheen               = ${this.getDataBehaviour(sheen)};
            sheenTint           = ${this.getDataBehaviour(sheenTint)};
            
            alpha = ${this.renderingType === MATERIAL_RENDERING_TYPES.TRANSPARENCY ? this.getDataBehaviour(opacity) : "1."};
            albedo = ${this.getData(al)};
            ${normal ? "computeTBN();" : ""}
            N = ${normal ? `normalize(TBN * ((${this.getData(normal)} * 2.0)- 1.0))` : "normalVec"};
            emission = ${this.getData(emission)}; 
        `
    }
}

