import EntityFactoryService from "../services/engine/EntityFactoryService"

import LIGHT_TYPES from "../../../engine/core/static/LIGHT_TYPES"
import EmbeddedMeshes from "../../../engine/core/static/EmbeddedMeshes"
import LocalizationEN from "../../../../shared/enums/LocalizationEN";

export default function getEntityCreationOptions() {
	return [
		{
			icon: "category",
			label: LocalizationEN.EMPTY_ENTITY,
			onClick: EntityFactoryService.createEmpty
		},
		{divider: true, label: LocalizationEN.MESHES},
		{
			icon: "category",
			label: LocalizationEN.CUBE,
			onClick: () => EntityFactoryService.createMesh(EmbeddedMeshes.CUBE)
		},
		{
			icon: "category",
			label: LocalizationEN.SPHERE,
			onClick: () => EntityFactoryService.createMesh(EmbeddedMeshes.SPHERE)
		},
		{
			icon: "category",
			label: LocalizationEN.PLANE,
			onClick: () => EntityFactoryService.createMesh(EmbeddedMeshes.PLANE)
		},
		{
			icon: "category",
			label: LocalizationEN.CYLINDER,
			onClick: () => EntityFactoryService.createMesh(EmbeddedMeshes.CYLINDER)
		},
		{divider: true, label: LocalizationEN.LIGHTS},
		{
			icon: "wb_iridescent",
			label: LocalizationEN.SPHERE_AREA,
			onClick: () => EntityFactoryService.createLight(LIGHT_TYPES.SPHERE)
		},
		{
			icon: "wb_iridescent",
			label: LocalizationEN.DISK_AREA,
			onClick: () => EntityFactoryService.createLight(LIGHT_TYPES.DISK)
		},
		{
			icon: "wb_iridescent",
			label: LocalizationEN.PLANE_AREA,
			onClick: () => EntityFactoryService.createLight(LIGHT_TYPES.PLANE)
		},


		{
			icon: "lightbulb",
			label: LocalizationEN.POINT_LIGHT,
			onClick: () => EntityFactoryService.createLight(LIGHT_TYPES.POINT)
		},
		{
			icon: "light_mode",
			label: LocalizationEN.DIRECTIONAL_LIGHT,
			onClick: () => EntityFactoryService.createLight(LIGHT_TYPES.DIRECTIONAL)
		},
		{
			icon: "highlight",
			label: LocalizationEN.SPOTLIGHT,
			onClick: () => EntityFactoryService.createLight(LIGHT_TYPES.SPOT)
		},
		{
			icon: "wb_twilight",
			label: LocalizationEN.ATMOSPHERE_RENDERER,
			onClick: () => EntityFactoryService.createAtmosphere()
		},

		{
			icon: "lens_blur",
			label: LocalizationEN.LIGHT_PROBE,
			onClick: () => EntityFactoryService.createProbe()
		},


		{divider: true, label: LocalizationEN.UTILS},
		{
			icon: "videocam",
			label: LocalizationEN.CAMERA,
			onClick: EntityFactoryService.createCamera
		},

		{
			icon: "image",
			label: LocalizationEN.SPRITE,
			onClick: EntityFactoryService.createSprite
		},
		{
			icon: "layers",
			label: LocalizationEN.DECAL,
			onClick: EntityFactoryService.createDecal
		},
		{
			icon: "widgets",
			label: LocalizationEN.UI_RENDERER,
			onClick: EntityFactoryService.createUI
		}
	]
}