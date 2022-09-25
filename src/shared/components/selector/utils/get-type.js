

export default function getType(store, type, mergeMaterials) {
    switch (type) {
        case "image":
            return store.textures
        case "material":
            if(mergeMaterials)
            return [...store.materials,  ...store.materialInstances]
            else
                return store.materials
        case "mesh":
            return store.meshes
        case "script":
            return store.scripts
        case "ui":
            return store.uiLayouts
        case "terrain":
            return store.terrains

        case "code":
            return [...store.uiLayouts, ...store.components]
        default:
            return []
    }
}