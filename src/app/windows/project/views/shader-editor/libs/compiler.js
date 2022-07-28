import cloneClass from "../../../engine/utils/cloneClass"
import NODE_TYPES from "../data/NODE_TYPES"
import deferredTemplate from "../templates/deferredTemplate"
import forwardTemplate from "../templates/forwardTemplate"
import resolveStructure from "./resolveStructure"
import {vertex} from "../../../engine/shaders/mesh/FALLBACK.glsl"
import MATERIAL_RENDERING_TYPES from "../../../engine/data/MATERIAL_RENDERING_TYPES"
import unlitTemplate from "../templates/unlitTemplate"

function getShadingTemplate(type) {
    switch (type) {
    case MATERIAL_RENDERING_TYPES.FORWARD:
        return forwardTemplate
    case MATERIAL_RENDERING_TYPES.DEFERRED:
        return deferredTemplate
    default:
        return unlitTemplate
    }
}

export default async function compiler(n, links) {
    const nodes = n.map(nn => cloneClass(nn))
    const startPoint = nodes.find(n => {
        return n.type === NODE_TYPES.OUTPUT
    })
    if (startPoint) {
        const samplers = n.filter(e => typeof e.format === "object"), uniformNodes = n.filter(e => e.uniform)
        const {
            code,
            uniforms,
            uniformData
        } = await compileFrag(n, links, startPoint.shadingType)
        // const vertexBody = compileVertex(startPoint, n, links)
        const cubeMapShader = await compileFrag(
            n,
            links,
            MATERIAL_RENDERING_TYPES.FORWARD,
            [
                "al",
                "normal",
                "ao",
                "roughness",
                "metallic",
                "opacity",
                "emission",
                "worldOffset"
            ], false)

        return {
            info: [{key: "samplers", label: "Texture samplers", data: samplers.length}, {
                key: "uniforms",
                label: "Uniform quantity",
                data: uniformNodes.length
            },],
            cubeMapShader,
            shader: code,
            vertexShader: vertex,
            uniforms,
            uniformData,
            settings: {
                shadingType: startPoint.shadingType,
                isForwardShaded: startPoint.shadingType !== MATERIAL_RENDERING_TYPES.DEFERRED,
                rsmAlbedo: startPoint.rsmAlbedo,
                doubledSided: startPoint.doubledSided,

                depthMask: startPoint.depthMask,
                depthTest: startPoint.depthTest,
                cullFace: startPoint.cullFace,
                blend: startPoint.blend,
                blendFuncTarget: startPoint.blendFuncTarget,
                blendFuncSource: startPoint.blendFuncSource,
            }
        }
    } else return {}
}

//
// function compileVertex(startPoint, n, links) {
//     let vertexBody = []
//     const nodes = n.map(nn => cloneClass(nn))
//     resolveStructure(startPoint, [], links.filter(l => l.target.id !== startPoint.id || l.target.id === startPoint.id && l.target.attribute.key === "worldOffset"), nodes, vertexBody, true)
//     return vertexBody.join("\n")
// }

async function compileFrag(n, links,  shadingType, discardedLinks=["worldOffset"], noAmbient) {
    const nodes = n.map(nn => cloneClass(nn))
    const startPoint = nodes.find(n => {
        return n.type === NODE_TYPES.OUTPUT
    })
    startPoint.shadingType = shadingType
    if(noAmbient)
        startPoint.ambientInfluence = false
    const codeString = getShadingTemplate(shadingType),
        uniforms = [],
        uniformData = []
    let toJoin = [], typesInstantiated = {}
    nodes.forEach(n => {
        if (n.type === NODE_TYPES.FUNCTION && !typesInstantiated[n.constructor.name]) {

            toJoin.push(n.getFunctionInstance())
            typesInstantiated[n.constructor.name] = true
        }
    })
    codeString.functions = toJoin.join("\n")
    toJoin = []
    typesInstantiated = {}
    await Promise.all(nodes.map((n, i) => new Promise(async resolve => {
        if (typeof n.getInputInstance === "function" && !typesInstantiated[n.id]) {
            const res = await n.getInputInstance(i, uniforms, uniformData)
            toJoin.push(res)
            resolve()
            typesInstantiated[n.id] = true
        } else resolve()
    })))
    codeString.inputs = toJoin.join("\n")


    let body = []
    resolveStructure(startPoint, [], links.filter(l => l.target.id !== startPoint.id || l.target.id === startPoint.id && !discardedLinks.includes(l.target.key)), nodes, body, false)
    return {
        code: `
            ${codeString.static}
            ${codeString.inputs}
            ${codeString.functions}
            ${codeString.wrapper(body.join("\n"), startPoint.ambientInfluence)}
        `,
        uniforms,
        uniformData
    }

}