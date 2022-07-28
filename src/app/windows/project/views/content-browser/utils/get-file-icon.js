import FILE_TYPES from "../../../../../../static/FILE_TYPES";

export default function getFileIcon(type) {
    switch ("." + type) {
    case FILE_TYPES.IMAGE:
        return "image"
    case FILE_TYPES.MATERIAL:
        return "texture"
    case FILE_TYPES.MESH:
        return "view_in_ar"
    default:
        return
    }
}
