import NODE_TYPES from "../data/NODE_TYPES"
import deferredTemplate from "../templates/shaders/deferred-shader"
import forwardTemplate from "../templates/shaders/forward-shader"
import resolveRelationship from "./resolve-relationship"
import unlitTemplate from "../templates/shaders/unlit-shader"
import MATERIAL_RENDERING_TYPES from "../../../../../public/engine/static/MATERIAL_RENDERING_TYPES";

import skyboxShader, {vertexSkybox} from "../templates/shaders/skybox-shader";
import cloneClass from "../../../utils/clone-class";
import TEMPLATE_VERTEX_SHADER from "../../../../../public/engine/static/TEMPLATE_VERTEX_SHADER";


function getShadingTemplate(type) {
    switch (type) {
        case MATERIAL_RENDERING_TYPES.FORWARD:
            return forwardTemplate
        case MATERIAL_RENDERING_TYPES.DEFERRED:
            return deferredTemplate
        case MATERIAL_RENDERING_TYPES.SKYBOX:
            return skyboxShader
        default:
            return unlitTemplate
    }
}

function getShaderVertex(type) {
    if(type === MATERIAL_RENDERING_TYPES.SKYBOX)
        return vertexSkybox
    return TEMPLATE_VERTEX_SHADER
}

export default async function compiler(n, links) {
    const nodes = n.map(nn => cloneClass(nn))
    const startPoint = nodes.find(n => n.type === NODE_TYPES.OUTPUT)

    if (startPoint) {
        const samplers = n.filter(e => typeof e.format === "object"), uniformNodes = n.filter(e => e.uniform)
        const {
            code,
            uniforms,
            uniformData
        } = await compileFrag(
            n,
            links,
            startPoint.shadingType,
            startPoint.inputs.map(i => {
                if (i.disabled)
                    return i.key
                return undefined
            }).filter(i => i)
        )

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
            info: [
                {key: "samplers", label: "Texture samplers", data: samplers.length},
                {key: "uniforms", label: "Uniform quantity", data: uniformNodes.length}
            ],
            cubeMapShader,
            shader: code,
            vertexShader: getShaderVertex(startPoint.shadingType),
            uniforms,
            uniformData,
            settings: {
                shadingType: startPoint.shadingType,
                faceCulling: startPoint.faceCulling,
                depthTest: startPoint.depthTest,
                blend: startPoint.blend
            }
        }
    } else return {}
}

//
// function compileVertex(startPoint, n, links) {
//     let vertexBody = []
//     const nodes = n.map(nn => cloneClass(nn))
//     resolveRelationship(startPoint, [], links.filter(l => l.target.id !== startPoint.id || l.target.id === startPoint.id && l.target.attribute.key === "worldOffset"), nodes, vertexBody, true)
//     return vertexBody.join("\n")
// }

async function compileFrag(n, links, shadingType, discardedLinks = ["worldOffset"], noAmbient) {
    const nodes = n.map(nn =>  cloneClass(nn))
    const startPoint = nodes.find(n => n.type === NODE_TYPES.OUTPUT)
    startPoint.shadingType = shadingType
    if (noAmbient)
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
    resolveRelationship(startPoint, [], links.filter(l => l.target.id !== startPoint.id || l.target.id === startPoint.id && !discardedLinks.includes(l.target.key)), nodes, body, false)
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