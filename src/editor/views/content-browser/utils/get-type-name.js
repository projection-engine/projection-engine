import FILE_TYPES from "../../../../static/FILE_TYPES";

export default function getTypeName(type) {
    switch ("." + type) {
        case FILE_TYPES.MESH:
            return "Mesh"
        case FILE_TYPES.LEVEL:
            return "Level"
        case FILE_TYPES.STYLESHEET:
            return "Stylesheet"
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
        default:
            return ""
    }
}