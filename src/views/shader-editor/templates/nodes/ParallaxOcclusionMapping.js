import Node from "./Node"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"
import checkGlslFloat from "../../utils/check-glsl-float"


export default class ParallaxOcclusionMapping extends Node {
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

    getFunctionInstance() {
        return `
                vec2 parallaxMapping (vec2 texCoords, vec3 viewDir, sampler2D heightMap, float heightScale, float layers){
                   float layer_depth = 1.0 / layers;
                   float currentLayerDepth = 0.0;
                   vec2 delta_uv = viewDir.xy * heightScale / (viewDir.z * layers);
                   vec2 cur_uv = texCoords;
                
                   float depth_from_tex = 1.-texture(heightMap, cur_uv).r;
                
                   for (int i = 0; i < 32; i++) {
                       currentLayerDepth += layer_depth;
                       cur_uv -= delta_uv;
                       depth_from_tex = 1.-texture(heightMap, cur_uv).r;
                       if (depth_from_tex < currentLayerDepth) 
                           break;
                   }
                   vec2 prev_uv = cur_uv + delta_uv;
                   float next = depth_from_tex - currentLayerDepth;
                   float prev = texture(heightMap, prev_uv).r - currentLayerDepth
                                + layer_depth;
                   float weight = next / (next - prev);
                   vec2 UVs = mix(cur_uv, prev_uv, weight);
                   ${this.discard ? `
                   if (UVs.x > 1.0 || UVs.y > 1.0 || UVs.x < 0.0 || UVs.y < 0.0)
                       discard;
                   ` : ""}
                   
                   return UVs;
                }
        `
    }

     

    getFunctionCall({heightMap, viewDirection, texCoords}, index) {
        this.UVs = "UVs" + index
        return `vec2 ${this.UVs} = parallaxMapping( ${texCoords.name},  ${viewDirection.name},  ${heightMap.name},  ${checkGlslFloat(this.heightScale)},  ${checkGlslFloat(this.layers)} );`
    }

}