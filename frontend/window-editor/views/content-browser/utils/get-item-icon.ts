import FileTypes from "../../../../../contants/FileTypes";

export default function getItemIcon(metadata, type) {
	let icon
	if (type === 0)
		icon = metadata.childQuantity === 0 ? "folder_open" : "folder"
	else
		switch (metadata.type) {
		case FileTypes.COMPONENT:
			icon = "code"
			break
		case FileTypes.COLLECTION:
			icon = "inventory_2"
			break
		case FileTypes.LEVEL:
			icon = "forest"
			break
		case FileTypes.UI_LAYOUT:
			icon = "view_quilt"
			break

		case ".js":
			icon = "javascript"
			break
		case ".json":
			icon = "data_object"
			break
		default:
			icon = undefined
			break
		}


	return icon
}