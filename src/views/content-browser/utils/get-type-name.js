import FILE_TYPES from "shared-resources/FILE_TYPES";

export default function getTypeName(type) {
    switch ("." + type) {
        case FILE_TYPES.MESH:
            return "Mesh"
        case FILE_TYPES.LEVEL:
            return "Level"
        case FILE_TYPES.UI_LAYOUT:
            return "UI layout"
        case FILE_TYPES.COMPONENT:
            return "Component"
        case FILE_TYPES.MATERIAL:
            return "Material"
        case FILE_TYPES.TEXTURE:
            return "Texture"

        case FILE_TYPES.SCENE:
            return "Scene"
        case FILE_TYPES.MATERIAL_INSTANCE:
            return "Material Instance"
        case FILE_TYPES.SIMPLE_MATERIAL:
            return "Simple material"
        case FILE_TYPES.TERRAIN:
            return "Terrain"
        default:
            return ""
    }
}