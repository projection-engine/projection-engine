export default function selectEntityHierarchy(start) {
    const result = []
    const direct = start.children
    direct.forEach(d => result.push(...selectEntityHierarchy(d)))
    result.push(...direct.map(c => c.id))
    return result
}