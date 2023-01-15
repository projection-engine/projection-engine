import type ShaderLink from "../../../templates/ShaderLink";
import type ShaderNode from "../../../templates/ShaderNode";

export default function resolveRelationship(currentNode: ShaderNode, outputs: string[], links: ShaderLink[], nodes: ShaderNode[], body: string[], executionSignature: { signature: string }) {
    const inputs = {}
    executionSignature.signature += currentNode.constructor.name + currentNode.uniform ? "-dynamic-" : "-static-"

    const linksToResolve = links.filter(l => l.targetNode.id === currentNode.id)
    linksToResolve.forEach(link => {
        const source = nodes.find(n => n.id === link.sourceNode.id)
        if (!source.ready) {
            const localOutputs = links.filter(l => l.sourceNode.id === source.id).map(l => l.sourceRef.key)
            resolveRelationship(source, localOutputs, links, nodes, body, executionSignature)
        }

        inputs[link.targetRef.key] = {
            name: source[link.sourceRef.key],
            type: link.sourceRef.type
        }
        executionSignature.signature += link.targetNode.id + link.targetRef.key+ link.sourceNode.id + link.sourceRef.key
    })
    executionSignature.signature += ";-;"
    body.push(currentNode.getFunctionCall(inputs, nodes.findIndex(n => n.id === currentNode.id), outputs, body))
    currentNode.ready = true
}