import COMPONENTS from "../../../engine-core/static/COMPONENTS"

export default function getComponentIcon(key) {
	switch (key) {
	case COMPONENTS.MESH:
		return "category"
	case COMPONENTS.LIGHT:
		return "light_mode"
	case COMPONENTS.CAMERA:
		return "videocam"
	case COMPONENTS.ATMOSPHERE:
		return "wb_twilight"
	case COMPONENTS.LIGHT_PROBE:
		return "lens_blur"
	case "TRANSFORMATION":
		return "transform"
	case COMPONENTS.DECAL:
		return "layers"
	case COMPONENTS.SPRITE:
		return "image"
	case COMPONENTS.PHYSICS_COLLIDER:
		return "compare_arrows"
	case COMPONENTS.RIGID_BODY:
		return "language"

	case COMPONENTS.CULLING:
		return "disabled_visible"
	case COMPONENTS.UI:
		return "widgets"
		// case COMPONENTS.TERRAIN:
		//     return "landscape"
	default:
		return "code"
	}
}