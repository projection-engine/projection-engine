import resolveRelationship from "./resolve-relationship";
import TextureSample from "../../nodes/TextureSample";

export default async function compileFragmentShader(startPoint, nodes, links) {
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
            if(n instanceof TextureSample)
                textureOffset++
            if(res.includes("const "))
                constants.push(res)
            else
                uniformDeclarations.push(res)
            typesInstantiated[n.id] = true
        }
    }

    let body:string[] = []
    resolveRelationship(startPoint, [], links.filter(l => l.targetRef.id !== startPoint.id || l.targetRef.id === startPoint.id), nodes, body)
    return {
        functionDeclaration: constants.join("\n") + "\n" + body.join("\n"),
        uniformsDeclaration: uniformDeclarations.join("\n"),
        uniforms,
        uniformValues
    }

}