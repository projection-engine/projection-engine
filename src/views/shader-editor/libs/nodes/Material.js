import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"
import MATERIAL_RENDERING_TYPES from "../../../../../public/engine/static/MATERIAL_RENDERING_TYPES"
import checkGlslFloat from "../../utils/check-glsl-float";

function enableAll(ref) {
    ref.inputs = ref.inputs.map(i => {

        i.disabled = false
        return i
    })
}

function arrayToGlsl(a) {
    const arr = Array.isArray(a) ? a : [0, 0, 0]
    return "vec3(" + arr.map(a => checkGlslFloat(parseFloat(a.toFixed(4)))) + ")"
}

export default class Material extends ShaderNode {
    ambientInfluence = true
    shadingType = MATERIAL_RENDERING_TYPES.DEFERRED
    rsmAlbedo

    canBeDeleted = false

    faceCulling = true
    depthTest = true
    cullBackFace = false
    blend = true
    blendFuncSource = "ONE_MINUS_SRC_COLOR"
    blendFuncTarget = "ONE_MINUS_DST_ALPHA"

    roughness = 1
    metallic = 0
    opacity = 1
    emission = [0, 0, 0]
    al = [0, 0, 0]

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
            {label: "Refraction", key: "refraction", accept: allTypes, disabled: true},

            {label: "Probe influence", key: "ambientInfluence", type: DATA_TYPES.CHECKBOX},

            {label: "Face culling", key: "faceCulling", type: DATA_TYPES.CHECKBOX},
            {label: "Depth test", key: "depthTest", type: DATA_TYPES.CHECKBOX},
            {label: "Blend", key: "blend", type: DATA_TYPES.CHECKBOX},

            {
                label: "Rendering type",
                key: "shadingType",
                type: DATA_TYPES.OPTIONS,
                options: [
                    {label: "Forward lit", data: MATERIAL_RENDERING_TYPES.FORWARD},
                    {label: "Deferred lit", data: MATERIAL_RENDERING_TYPES.DEFERRED},
                    {label: "Unlit", data: MATERIAL_RENDERING_TYPES.UNLIT},
                    {label: "Skybox", data: MATERIAL_RENDERING_TYPES.SKYBOX},
                ]
            }
        ], [])
        this.inputs.find(i => i.key === "shadingType").onChange = (v) => {
            switch (v) {
                case MATERIAL_RENDERING_TYPES.FORWARD:
                    enableAll(this)
                    this.inputs.find(i => i.key === "refraction").disabled = false
                    this.inputs.find(i => i.key === "opacity").disabled = false
                    this.inputs.find(i => i.key === "roughness").disabled = false
                    this.inputs.find(i => i.key === "metallic").disabled = false
                    this.inputs.find(i => i.key === "normal").disabled = false
                    break
                case MATERIAL_RENDERING_TYPES.DEFERRED:
                    enableAll(this)
                    this.inputs.find(i => i.key === "refraction").disabled = true
                    this.inputs.find(i => i.key === "opacity").disabled = true

                    this.inputs.find(i => i.key === "roughness").disabled = false
                    this.inputs.find(i => i.key === "metallic").disabled = false
                    this.inputs.find(i => i.key === "normal").disabled = false
                    break
                case MATERIAL_RENDERING_TYPES.SKYBOX:
                    this.inputs = this.inputs.map(i => {
                        if (i.accept === allTypes || i.type === DATA_TYPES.CHECKBOX)
                            i.disabled = i.key !== "al";
                        return i
                    })
                    break
                default:
                    this.inputs = this.inputs.map(i => {
                        if (i.accept === allTypes)
                            i.disabled = i.key !== "al";

                        if (i.key === "ambientInfluence")
                            i.disabled = true
                        return i
                    })
                    this.ambientInfluence = false
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
                        ao,
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
                        refraction,
                        emission = {
                            name: arrayToGlsl(this.emission),
                            type: DATA_TYPES.VEC3
                        },
                        // worldOffset
                    }) {

        if (this.shadingType === MATERIAL_RENDERING_TYPES.SKYBOX)
            return `vec4 gAlbedo = vec4(${al ? this.getData(al) : "vec3(.5, .5, .5)"}, 1.);`
        return `
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? "vec4" : ""} gAlbedo = vec4(${al ? this.getData(al) : "vec3(.5, .5, .5)"}, 1.) + vec4(${emission ? this.getData(emission) : "vec3(.0)"}, 0.);
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? "vec4" : ""} gNormal = ${normal ? `vec4(normalize(toTangentSpace * ((${this.getData(normal)} * 2.0)- 1.0)), 1.)` : "vec4(normalVec, 1.)"};
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? "vec4" : ""} gBehaviour =  vec4(${ao ? this.getDataBehaviour(ao) : "1."},${roughness !== undefined ? this.getDataBehaviour(roughness) : "1."},${roughness !== undefined ? this.getDataBehaviour(metallic) : "0."}, 1.);
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? `float opacity = ${roughness !== undefined ? this.getDataBehaviour(opacity) : "1."};` : ""}
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? `float refraction = ${refraction ? this.getDataBehaviour(refraction) : "0."};` : ""}
            `
    }
}

