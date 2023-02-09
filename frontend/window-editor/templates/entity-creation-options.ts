import EntityConstructor from "../lib/controllers/EntityConstructor";
import LOCALIZATION_EN from "../../../static/objects/LOCALIZATION_EN";
import LIGHT_TYPES from "../../../engine-core/static/LIGHT_TYPES";
import EmbeddedMeshes from "../../../engine-core/static/EmbeddedMeshes";

export default function entityCreationOptions() {
    return [
        {
            icon: "category",
            label: LOCALIZATION_EN.EMPTY_ENTITY,
            onClick: EntityConstructor.createEmpty
        },
        {divider: true, label: LOCALIZATION_EN.MESHES},
        {
            icon: "category",
            label: LOCALIZATION_EN.CUBE,
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.CUBE)
        },
        {
            icon: "category",
            label: LOCALIZATION_EN.SPHERE,
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.SPHERE)
        },
        {
            icon: "category",
            label: LOCALIZATION_EN.PLANE,
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.PLANE)
        },
        {
            icon: "category",
            label: LOCALIZATION_EN.CYLINDER,
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.CYLINDER)
        },
        {divider: true, label: LOCALIZATION_EN.LIGHTS},
        {
            icon: "wb_iridescent",
            label: LOCALIZATION_EN.SPHERE_AREA,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.SPHERE)
        },
        {
            icon: "wb_iridescent",
            label: LOCALIZATION_EN.DISK_AREA,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.DISK)
        },
        {
            icon: "wb_iridescent",
            label: LOCALIZATION_EN.PLANE_AREA,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.PLANE)
        },


        {
            icon: "lightbulb",
            label: LOCALIZATION_EN.POINT_LIGHT,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.POINT)
        },
        {
            icon: "light_mode",
            label: LOCALIZATION_EN.DIRECTIONAL_LIGHT,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.DIRECTIONAL)
        },
        {
            icon: "highlight",
            label: LOCALIZATION_EN.SPOTLIGHT,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.SPOT)
        },
        {
            icon: "wb_twilight",
            label: LOCALIZATION_EN.ATMOSPHERE_RENDERER,
            onClick: () => EntityConstructor.createAtmosphere()
        },

        {
            icon: "lens_blur",
            label: LOCALIZATION_EN.LIGHT_PROBE,
            onClick: () => EntityConstructor.createProbe()
        },


        {divider: true, label: LOCALIZATION_EN.UTILS},
        {
            icon: "videocam",
            label: LOCALIZATION_EN.CAMERA,
            onClick: EntityConstructor.createCamera
        },

        {
            icon: "image",
            label: LOCALIZATION_EN.SPRITE,
            onClick: EntityConstructor.createSprite
        },
        {
            icon: "layers",
            label: LOCALIZATION_EN.DECAL,
            onClick: EntityConstructor.createDecal
        },
        {
            icon: "widgets",
            label: LOCALIZATION_EN.UI_RENDERER,
            onClick: EntityConstructor.createUI
        }
    ]
}