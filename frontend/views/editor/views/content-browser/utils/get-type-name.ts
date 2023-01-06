import FILE_TYPES from "../../../../../../static/objects/FILE_TYPES";

export default function getTypeName(type) {
    switch ("." + type) {
        case FILE_TYPES.PRIMITIVE:
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
        case FILE_TYPES.COLLECTION:
            return "Scene"
        case FILE_TYPES.TERRAIN:
            return "Terrain"
        case ".js":
            return "Javascript package"
        case ".json":
            return "JSON object"
        default:
            return ""
    }
}