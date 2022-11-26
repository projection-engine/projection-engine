import DataController from "../instances/DataController";

export default function linkNodeToStructure(node) {
    if (!node || !node.children)
        return
    for (let i = 0; i < node.children.length; i++) {
        const children = DataController.glTFHierarchyNodes.get(node.children[i])
        if (children) {
            children.forEach(child => child.parent = node.id)
        }
    }
}