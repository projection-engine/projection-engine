export default function deleteNode(node, nodes, setNodes, links, setLinks, setSelected,) {
    const target = node
    setSelected([])

    setLinks(links.filter(el => el.target.id !== target && el.source.id !== target))
    let n = [...nodes]
    n.splice(n.findIndex(el => el.id === target), 1)

    setNodes(n)
}