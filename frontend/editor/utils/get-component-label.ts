import COMPONENTS from "../../../engine-core/static/COMPONENTS"
import LocalizationEN from "../../../shared/LocalizationEN";


export default function getComponentLabel(component) {
	switch (component) {
	case COMPONENTS.MESH:
		return  LocalizationEN.MESH
	case COMPONENTS.CAMERA:
		return  LocalizationEN.CAMERA
	case COMPONENTS.SPRITE:
		return  LocalizationEN.SPRITE
	case COMPONENTS.DECAL:
		return LocalizationEN.DECAL
	case COMPONENTS.LIGHT:
		return LocalizationEN.LIGHT
	case COMPONENTS.ATMOSPHERE:
		return LocalizationEN.ATMOSPHERE_RENDERER
	case COMPONENTS.LIGHT_PROBE:
		return LocalizationEN.LIGHT_PROBE
	case COMPONENTS.PHYSICS_COLLIDER:
		return  LocalizationEN.PHYSICS_COLLIDER
	case COMPONENTS.RIGID_BODY:
		return  LocalizationEN.RIGID_BODY
	case COMPONENTS.CULLING:
		return  LocalizationEN.CULLING
	case COMPONENTS.UI:
		return  LocalizationEN.UI_WRAPPER
        // case COMPONENTS.TERRAIN:
        //     return "Terrain"

	}
}