import EntityFactory from "../lib/controllers/EntityFactory";
import LOCALIZATION_EN from "../../../static/objects/LOCALIZATION_EN";
import LIGHT_TYPES from "../../../engine-core/static/LIGHT_TYPES";
import EmbeddedMeshes from "../../../engine-core/static/EmbeddedMeshes";

export default function entityCreationOptions() {
    return [
        {
            icon: "category",
            label: LOCALIZATION_EN.EMPTY_ENTITY,
            onClick: EntityFactory.createEmpty
        },
        {divider: true, label: LOCALIZATION_EN.MESHES},
        {
            icon: "category",
            label: LOCALIZATION_EN.CUBE,
            onClick: () => EntityFactory.createMesh(EmbeddedMeshes.CUBE)
        },
        {
            icon: "category",
            label: LOCALIZATION_EN.SPHERE,
            onClick: () => EntityFactory.createMesh(EmbeddedMeshes.SPHERE)
        },
        {
            icon: "category",
            label: LOCALIZATION_EN.PLANE,
            onClick: () => EntityFactory.createMesh(EmbeddedMeshes.PLANE)
        },
        {
            icon: "category",
            label: LOCALIZATION_EN.CYLINDER,
            onClick: () => EntityFactory.createMesh(EmbeddedMeshes.CYLINDER)
        },
        {divider: true, label: LOCALIZATION_EN.LIGHTS},
        {
            icon: "wb_iridescent",
            label: LOCALIZATION_EN.SPHERE_AREA,
            onClick: () => EntityFactory.createLight(LIGHT_TYPES.SPHERE)
        },
        {
            icon: "wb_iridescent",
            label: LOCALIZATION_EN.DISK_AREA,
            onClick: () => EntityFactory.createLight(LIGHT_TYPES.DISK)
        },
        {
            icon: "wb_iridescent",
            label: LOCALIZATION_EN.PLANE_AREA,
            onClick: () => EntityFactory.createLight(LIGHT_TYPES.PLANE)
        },


        {
            icon: "lightbulb",
            label: LOCALIZATION_EN.POINT_LIGHT,
            onClick: () => EntityFactory.createLight(LIGHT_TYPES.POINT)
        },
        {
            icon: "light_mode",
            label: LOCALIZATION_EN.DIRECTIONAL_LIGHT,
            onClick: () => EntityFactory.createLight(LIGHT_TYPES.DIRECTIONAL)
        },
        {
            icon: "highlight",
            label: LOCALIZATION_EN.SPOTLIGHT,
            onClick: () => EntityFactory.createLight(LIGHT_TYPES.SPOT)
        },
        {
            icon: "wb_twilight",
            label: LOCALIZATION_EN.ATMOSPHERE_RENDERER,
            onClick: () => EntityFactory.createAtmosphere()
        },

        {
            icon: "lens_blur",
            label: LOCALIZATION_EN.LIGHT_PROBE,
            onClick: () => EntityFactory.createProbe()
        },


        {divider: true, label: LOCALIZATION_EN.UTILS},
        {
            icon: "videocam",
            label: LOCALIZATION_EN.CAMERA,
            onClick: EntityFactory.createCamera
        },

        {
            icon: "image",
            label: LOCALIZATION_EN.SPRITE,
            onClick: EntityFactory.createSprite
        },
        {
            icon: "layers",
            label: LOCALIZATION_EN.DECAL,
            onClick: EntityFactory.createDecal
        },
        {
            icon: "widgets",
            label: LOCALIZATION_EN.UI_RENDERER,
            onClick: EntityFactory.createUI
        }
    ]
}