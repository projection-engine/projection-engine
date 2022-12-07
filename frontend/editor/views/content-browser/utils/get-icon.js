import FILE_TYPES from "shared-resources/FILE_TYPES";

export default function getIcon(icon, metadata, childQuantity, type) {
    if (icon)
        return icon
    if (type === 0)
        return childQuantity === 0 ? "folder_open" : "folder"
    if (metadata.type === FILE_TYPES.PRIMITIVE)
        return "category"
    return "texture"
}