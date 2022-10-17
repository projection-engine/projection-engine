

export default function getType(store, type, mergeMaterials, terrainMaterials) {
    switch (type) {
        case "image":
            return store.textures
        case "material":
            if(terrainMaterials)
                return store.terrainMaterials
            if(mergeMaterials)
                return [...store.materials,  ...store.materialInstances]
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