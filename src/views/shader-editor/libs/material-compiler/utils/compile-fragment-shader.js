import cloneClass from "../../../../../../public/engine/utils/clone-class";
import NODE_TYPES from "../templates/NODE_TYPES";
import resolveRelationship from "./resolve-relationship";

export default async function compileFragmentShader(n, links) {
    const uniforms = [],
        uniformData = [],
        uniformDeclarations = [],
        typesInstantiated = {},
        constants = []

    const nodes = n.map(nn => cloneClass(nn))
    const startPoint = nodes.find(n => n.type === NODE_TYPES.OUTPUT)
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (typeof n.getInputInstance === "function" && !typesInstantiated[n.id]) {
            const res = await n.getInputInstance(i, uniforms, uniformData)
            if(res.includes("const "))
                constants.push(res)
            else
                uniformDeclarations.push(res)
            typesInstantiated[n.id] = true
        }
    }

    let body = []
    resolveRelationship(startPoint, [], links.filter(l => l.targetRef.id !== startPoint.id || l.targetRef.id === startPoint.id), nodes, body, false)
    return {
        functionDeclaration: constants.join("\n") + "\n" + body.join("\n"),
        uniformsDeclaration: uniformDeclarations.join("\n"),
        uniforms,
        uniformData
    }

}