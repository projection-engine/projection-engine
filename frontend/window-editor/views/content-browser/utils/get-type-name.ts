import FileTypes from "../../../../../contants/FileTypes";

export default function getTypeName(type) {
	switch ("." + type) {
	case FileTypes.PRIMITIVE:
		return "Mesh"
	case FileTypes.LEVEL:
		return "Level"
	case FileTypes.UI_LAYOUT:
		return "UI layout"
	case FileTypes.COMPONENT:
		return "Component"
	case FileTypes.MATERIAL:
		return "Material"
	case FileTypes.TEXTURE:
		return "Texture"
	case FileTypes.COLLECTION:
		return "Scene"
	case ".js":
		return "Javascript package"
	case ".json":
		return "JSON object"
	default:
		return ""
	}
}