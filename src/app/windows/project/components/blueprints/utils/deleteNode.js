export default function deleteNode(node, hook) {
    const target = node
    hook.setSelected([])
    let found = hook.links.filter(el => el.target.id === target || el.source.id === target)
    if (found.length > 0) {
        hook.setChanged(true)
        hook.setImpactingChange(true)
    }
    hook.setLinks(hook.links.filter(el => el.target.id !== target&& el.source.id !== target))
    hook.setNodes(prev => {
        let n = [...prev]
        n.splice(n.findIndex(el => el.id === target), 1)
        return n
    })
}