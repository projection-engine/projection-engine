import FILE_TYPES from "../../../../../../data/FILE_TYPES";

export default function getFileIcon(type) {
    switch ("." + type) {
    case FILE_TYPES.TEXTURE:
        return "image"
    case FILE_TYPES.MATERIAL:
        return "texture"
    case FILE_TYPES.MESH:
        return "category"
    default:
        return
    }
}
