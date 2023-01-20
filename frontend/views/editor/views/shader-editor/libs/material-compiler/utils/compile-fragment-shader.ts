import resolveRelationship from "./resolve-relationship";
import type ShaderNode from "../../../templates/ShaderNode";
import type ShaderLink from "../../../templates/ShaderLink";
import MaterialUniform from "../../../../../../../../engine-core/templates/MaterialUniform";
import NODE_MAP from "../../../static/NODE_MAP";

type response = { functionDeclaration: string, uniformsDeclaration: string, uniforms: Object[] , uniformValues: MaterialUniform[] }
export default async function compileFragmentShader(startPoint: ShaderNode, nodes: ShaderNode[], links: ShaderLink[], executionSignature: {signature:string}):Promise<response> {
    const uniforms = [],
        uniformValues = [],
        uniformDeclarations = [],
        typesInstantiated = {},
        constants = []

    let textureOffset = 0
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (typeof n.getInputInstance === "function" && !typesInstantiated[n.id]) {
            const res = await n.getInputInstance(i, uniforms, uniformValues, textureOffset)
            if (n instanceof NODE_MAP.TextureSample)
                textureOffset++
            if (res.includes("const "))
                constants.push(res)
            else
                uniformDeclarations.push(res)
            typesInstantiated[n.id] = true
        }
    }

    const body: string[] = []
    resolveRelationship(startPoint, [], links.filter(l => l.targetNode.id !== startPoint.id || l.targetNode.id === startPoint.id), nodes, body, executionSignature)
    return {
        functionDeclaration: constants.join("\n") + "\n" + body.join("\n"),
        uniformsDeclaration: uniformDeclarations.join("\n"),
        uniforms,
        uniformValues
    }
}