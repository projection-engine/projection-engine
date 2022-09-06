

export default function getType(store, type) {
    switch (type) {
        case "image":
            return store.textures
        case "material":
            return store.materials
        case "mesh":
            return store.meshes
        case "script":
            return store.scripts
        default:
            return []
    }
}