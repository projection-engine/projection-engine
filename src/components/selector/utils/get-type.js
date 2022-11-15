import Engine from "../../../../public/engine/Engine";


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

        case "ui":
            return store.uiLayouts
        case "terrain":
            return store.terrains

        case "code":
            return [...store.uiLayouts, ...store.components]
        case "parent":
            return Engine.entities
        default:
            return []
    }
}