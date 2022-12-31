import MutableObject from "../../../../../../../engine-core/MutableObject";
import {Output} from "../../../templates/ShaderNode";
import ShaderLink from "../../../templates/ShaderLink";

export default function resolveRelationship(currentNode:MutableObject, outputs:Output[], links:ShaderLink[], nodes:MutableObject[], body:string[], isVertex?:boolean) {
    const inputs = {}
    const linksToResolve = links.filter(l => l.targetRef.id === currentNode.id)
    linksToResolve.forEach(link => {
        const source = nodes.find(n => n.id === link.sourceRef.id)
        if (!source.ready)
            resolveRelationship(source, links.filter(l => l.sourceRef.id === source.id).map(l => l.sourceRef.attribute.key), links, nodes, body)

        inputs[link.targetRef.attribute.key] = {
            name: source[link.sourceRef.attribute.key],
            type: link.sourceRef.attribute.type
        }
    })
    body.push(currentNode.getFunctionCall(inputs, nodes.findIndex(n => n.id === currentNode.id), outputs, body, isVertex))
    currentNode.ready = true
}