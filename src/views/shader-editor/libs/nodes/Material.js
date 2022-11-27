import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../material-compiler/templates/NODE_TYPES"
import checkGlslFloat from "../../utils/check-glsl-float";


function arrayToGlsl(a) {
    const arr = Array.isArray(a) ? a : [0, 0, 0]
    return "vec3(" + arr.map(a => checkGlslFloat(parseFloat(a.toFixed(4)))) + ")"
}

export default class Material extends ShaderNode {
    alphaTested = false
    canBeDeleted = false

    faceCulling = true
    depthTest = true

    depthMask = true
    refraction = 0
    roughness = 1
    metallic = 0
    opacity = 1
    emission = [0, 0, 0]
    al = [0, 0, 0]
    flatShading = false

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
            {label: "Refraction", key: "refraction", accept: allTypes, type: DATA_TYPES.FLOAT},



            {label: "Is alpha tested", key: "alphaTested", type: DATA_TYPES.CHECKBOX},
            {label: "Face culling", key: "faceCulling", type: DATA_TYPES.CHECKBOX},
            {label: "Depth test", key: "depthTest", type: DATA_TYPES.CHECKBOX},
            {label: "Flat shading", key: "flatShading", type: DATA_TYPES.CHECKBOX},
            {label: "Write to depth-buffer", key: "depthMask", type: DATA_TYPES.CHECKBOX},
        ], [])

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
                        refraction = {
                            name: checkGlslFloat(this.refraction),
                            type: DATA_TYPES.FLOAT
                        },
                        emission = {
                            name: arrayToGlsl(this.emission),
                            type: DATA_TYPES.VEC3
                        }
                    }) {

        return `
            naturalAO = ${this.getDataBehaviour(ao)};
            roughness = ${this.getDataBehaviour(roughness)};
            metallic = ${this.getDataBehaviour(metallic)};
            refractionIndex = ${this.getDataBehaviour(refraction)};
            alpha = ${this.getDataBehaviour(opacity)};
            albedo = ${this.getData(al)};
            N = ${normal ? `normalize(TBN * ((${this.getData(normal)} * 2.0)- 1.0))` : "normalVec"};
            emission = ${this.getData(emission)};
            flatShading = ${this.flatShading};
        `
    }
}

