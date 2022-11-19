export default function resolveRelationship(currentNode, outputs, links, nodes, body, isVertex) {
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