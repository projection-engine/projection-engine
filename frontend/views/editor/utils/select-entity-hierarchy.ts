import Entity from "../../../../engine-core/instances/Entity";

export default function selectEntityHierarchy(start:Entity):string[] {
    const result:string[] = []
    const direct = start.children
    direct.forEach(d => result.push(...selectEntityHierarchy(d)))
    result.push(...direct.map(c => c.id))
    return result
}