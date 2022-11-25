import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../material-compiler/templates/NODE_TYPES"
import checkGlslFloat from "../../utils/check-glsl-float"


export default class ParallaxOcclusionMapping extends ShaderNode {
    heightScale = 1.
    layers = 32
    discard = false

    constructor() {
        super([
            {
                label: "Discard off-pixels",
                key: "discard",
                type: DATA_TYPES.CHECKBOX
            },
            {
                label: "Height scale",
                key: "heightScale",
                type: DATA_TYPES.FLOAT
            },
            {
                label: "Layers",
                key: "layers",
                type: DATA_TYPES.INT
            },

            {
                label: "Texture Coords",
                key: "texCoords",
                accept: [DATA_TYPES.VEC2]
            },
            {
                label: "View direction",
                key: "viewDirection",
                accept: [DATA_TYPES.VEC3]
            },
            {
                label: "Height Map",
                key: "heightMap",
                accept: [DATA_TYPES.TEXTURE]
            }
        ], [
            {label: "UVs", key: "UVs", type: DATA_TYPES.VEC2}
        ])
        this.name = "ParallaxOcclusionMapping"

    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({heightMap, viewDirection, texCoords}, index) {
        this.UVs = "UVs" + index
        return `vec2 ${this.UVs} = parallaxOcclusionMapping(${texCoords.name},  ${viewDirection.name},  ${this.discard ? "true" : "false"}, ${heightMap.name},  ${checkGlslFloat(this.heightScale)},  ${checkGlslFloat(this.layers)} );`
    }
}