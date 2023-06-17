import EntityFactory from "../lib/controllers/EntityFactory"

import LIGHT_TYPES from "../../../engine-core/static/LIGHT_TYPES"
import EmbeddedMeshes from "../../../engine-core/static/EmbeddedMeshes"
import LocalizationEN from "../../../contants/LocalizationEN";

export default function entityCreationOptions() {
	return [
		{
			icon: "category",
			label: LocalizationEN.EMPTY_ENTITY,
			onClick: EntityFactory.createEmpty
		},
		{divider: true, label: LocalizationEN.MESHES},
		{
			icon: "category",
			label: LocalizationEN.CUBE,
			onClick: () => EntityFactory.createMesh(EmbeddedMeshes.CUBE)
		},
		{
			icon: "category",
			label: LocalizationEN.SPHERE,
			onClick: () => EntityFactory.createMesh(EmbeddedMeshes.SPHERE)
		},
		{
			icon: "category",
			label: LocalizationEN.PLANE,
			onClick: () => EntityFactory.createMesh(EmbeddedMeshes.PLANE)
		},
		{
			icon: "category",
			label: LocalizationEN.CYLINDER,
			onClick: () => EntityFactory.createMesh(EmbeddedMeshes.CYLINDER)
		},
		{divider: true, label: LocalizationEN.LIGHTS},
		{
			icon: "wb_iridescent",
			label: LocalizationEN.SPHERE_AREA,
			onClick: () => EntityFactory.createLight(LIGHT_TYPES.SPHERE)
		},
		{
			icon: "wb_iridescent",
			label: LocalizationEN.DISK_AREA,
			onClick: () => EntityFactory.createLight(LIGHT_TYPES.DISK)
		},
		{
			icon: "wb_iridescent",
			label: LocalizationEN.PLANE_AREA,
			onClick: () => EntityFactory.createLight(LIGHT_TYPES.PLANE)
		},


		{
			icon: "lightbulb",
			label: LocalizationEN.POINT_LIGHT,
			onClick: () => EntityFactory.createLight(LIGHT_TYPES.POINT)
		},
		{
			icon: "light_mode",
			label: LocalizationEN.DIRECTIONAL_LIGHT,
			onClick: () => EntityFactory.createLight(LIGHT_TYPES.DIRECTIONAL)
		},
		{
			icon: "highlight",
			label: LocalizationEN.SPOTLIGHT,
			onClick: () => EntityFactory.createLight(LIGHT_TYPES.SPOT)
		},
		{
			icon: "wb_twilight",
			label: LocalizationEN.ATMOSPHERE_RENDERER,
			onClick: () => EntityFactory.createAtmosphere()
		},

		{
			icon: "lens_blur",
			label: LocalizationEN.LIGHT_PROBE,
			onClick: () => EntityFactory.createProbe()
		},


		{divider: true, label: LocalizationEN.UTILS},
		{
			icon: "videocam",
			label: LocalizationEN.CAMERA,
			onClick: EntityFactory.createCamera
		},

		{
			icon: "image",
			label: LocalizationEN.SPRITE,
			onClick: EntityFactory.createSprite
		},
		{
			icon: "layers",
			label: LocalizationEN.DECAL,
			onClick: EntityFactory.createDecal
		},
		{
			icon: "widgets",
			label: LocalizationEN.UI_RENDERER,
			onClick: EntityFactory.createUI
		}
	]
}