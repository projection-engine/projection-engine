import Node from "./Node"
import {DATA_TYPES} from "../../../../engine/data/DATA_TYPES"
import NODE_TYPES from "../../data/NODE_TYPES"
import MATERIAL_RENDERING_TYPES from "../../../../engine/data/MATERIAL_RENDERING_TYPES"

const blendOptions = [
    {label: "ZERO", data: "ZERO"},
    {label: "ONE", data: "ONE"},
    {label: "SRC_COLOR", data: "SRC_COLOR"},
    {label: "ONE_MINUS_SRC_COLOR", data: "ONE_MINUS_SRC_COLOR"},
    {label: "DST_COLOR", data: "DST_COLOR"},
    {label: "ONE_MINUS_DST_COLOR", data: "ONE_MINUS_DST_COLOR"},
    {label: "SRC_ALPHA", data: "SRC_ALPHA"},
    {label: "ONE_MINUS_SRC_ALPHA", data: "ONE_MINUS_SRC_ALPHA"},
    {label: "DST_ALPHA", data: "DST_ALPHA"},
    {label: "ONE_MINUS_DST_ALPHA", data: "ONE_MINUS_DST_ALPHA"},
    {label: "CONSTANT_COLOR", data: "CONSTANT_COLOR"},
    {label: "ONE_MINUS_CONSTANT_COLOR", data: "ONE_MINUS_CONSTANT_COLOR"},
    {label: "CONSTANT_ALPHA", data: "CONSTANT_ALPHA"},
    {label: "ONE_MINUS_CONSTANT_ALPHA", data: "ONE_MINUS_CONSTANT_ALPHA"},
    {label: "SRC_ALPHA_SATURATE", data: "SRC_ALPHA_SATURATE"},
]
export default class Material extends Node {
    ambientInfluence = true
    shadingType = MATERIAL_RENDERING_TYPES.DEFERRED
    rsmAlbedo

    canBeDeleted = false

    faceCulling = true
    depthMask = true
    depthTest = true
    cullBackFace = false
    blend = true
    blendFuncSource = "ONE_MINUS_SRC_COLOR"
    blendFuncTarget = "ONE_MINUS_DST_ALPHA"

    roughness = 1
    metallic = 0
    opacity = 1
    emission = [0,0,0]
    al = [0,0,0]
    constructor() {
        const allTypes = [DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2, DATA_TYPES.FLOAT, DATA_TYPES.INT]
        super([
            {label: "Albedo", key: "al", accept: allTypes, type: DATA_TYPES.COLOR},
            {label: "Normal", key: "normal", accept: allTypes},

            {label: "Ambient Occlusion", key: "ao", accept: allTypes},
            {label: "Roughness", key: "roughness", accept: allTypes, type: DATA_TYPES.FLOAT, max: 1, min: 0},
            {label: "Metallic", key: "metallic", accept: allTypes, type: DATA_TYPES.FLOAT, max: 1, min: 0},
            {label: "Emission", key: "emission", accept: allTypes, type: DATA_TYPES.COLOR},
            // {label: "World Offset", key: "worldOffset", accept: [DATA_TYPES.VEC4]},

            {label: "Opacity", key: "opacity", accept: allTypes, disabled: true, type: DATA_TYPES.FLOAT, max: 1, min: 0},
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
                    {label: "Unlit", data: MATERIAL_RENDERING_TYPES.UNLIT}
                ]
            }
        ], [])
        this.inputs.find(i => i.key === "shadingType").onChange = (v) => {
            switch (v){
            case MATERIAL_RENDERING_TYPES.FORWARD:
                this.inputs.find(i => i.key === "refraction").disabled = false
                this.inputs.find(i => i.key === "opacity").disabled = false
                this.inputs.find(i => i.key === "roughness").disabled =false
                this.inputs.find(i => i.key === "metallic").disabled = false
                this.inputs.find(i => i.key === "normal").disabled = false
                break
            case MATERIAL_RENDERING_TYPES.DEFERRED:
                this.inputs.find(i => i.key === "refraction").disabled = true
                this.inputs.find(i => i.key === "opacity").disabled = true

                this.inputs.find(i => i.key === "roughness").disabled =false
                this.inputs.find(i => i.key === "metallic").disabled = false
                this.inputs.find(i => i.key === "normal").disabled = false
                break
            default:
                this.inputs.find(i => i.key === "refraction").disabled = true
                this.inputs.find(i => i.key === "roughness").disabled = true
                this.inputs.find(i => i.key === "metallic").disabled = true
                this.inputs.find(i => i.key === "normal").disabled = true
                break
            }
        }
        this.inputs.find(i => i.key === "depthTest").onChange = (v) => {
            this.inputs.find(i => i.key === "depthMask").disabled = v
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
        al={
            name: this.al,
            type: DATA_TYPES.VEC3
        },
        normal,
        ao,
        roughness={
            name: this.roughness,
            type: DATA_TYPES.FLOAT
        },
        metallic={
            name: this.metallic,
            type: DATA_TYPES.FLOAT
        },
        opacity={
            name: this.opacity,
            type: DATA_TYPES.FLOAT
        },
        refraction,
        emission={
            name: this.emission,
            type: DATA_TYPES.VEC3
        },
        // worldOffset
    }, n1, n2, n3, isVertex) {

        if (!isVertex)
            return `
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? "vec4" : ""} gAlbedo = vec4(${al ? this.getData(al) : "vec3(.5, .5, .5)"}, 1.) + vec4(${emission ? this.getData(emission) : "vec3(.0)"}, 0.);
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? "vec4" : ""} gNormal = ${normal ? `vec4(normalize(toTangentSpace * ((${this.getData(normal)} * 2.0)- 1.0)), 1.)` : "vec4(normalVec, 1.)"};
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? "vec4" : ""} gBehaviour =  vec4(${ao ? this.getDataBehaviour(ao) : "1."},${roughness !== undefined ? this.getDataBehaviour(roughness) : "1."},${roughness !== undefined ? this.getDataBehaviour(metallic) : "0."}, 1.);
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? `float opacity = ${roughness !== undefined ? this.getDataBehaviour(opacity) : "1."};` : ""}
                ${this.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED ? `float refraction = ${refraction ? this.getDataBehaviour(refraction) : "0."};` : ""}
            `
        // else if (worldOffset)
        //     return `
        //         gl_Position += ${worldOffset.name};
        //     `
        else
            return ""
    }
}

