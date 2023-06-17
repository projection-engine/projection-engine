import FileTypes from "../../../../../shared/FileTypes";

export default function getIcon(icon, metadata, childQuantity, type) {
	if (icon)
		return icon
	if (type === 0)
		return childQuantity === 0 ? "folder_open" : "folder"
	if (metadata.type === FileTypes.PRIMITIVE)
		return "category"
	return "texture"
}