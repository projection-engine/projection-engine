import FILE_TYPES from "../../../../static/FILE_TYPES";

export default function getIcon(icon, metadata, childrenQuantity, type) {
    if (icon)
        return icon
    if (type === 0)
        return childrenQuantity === 0 ? "folder_open" : "folder"
    if (metadata.type === FILE_TYPES.MESH)
        return "category"
    return "texture"
}