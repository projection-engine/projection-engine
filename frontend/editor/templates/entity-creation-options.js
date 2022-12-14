import STATIC_MESHES from "../../../public/engine/static/resources/STATIC_MESHES";
import EntityConstructor from "../lib/controllers/EntityConstructor";
import Localization from "./LOCALIZATION_EN";
import LIGHT_TYPES from "../../../public/engine/static/LIGHT_TYPES";

export default function entityCreationOptions() {
    return [
        {
            icon: "category",
            label: Localization.EMPTY_ENTITY,
            onClick: EntityConstructor.createEmpty
        },
        {divider: true, label: Localization.MESHES},
        {
            icon: "category",
            label: Localization.CUBE,
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.CUBE)
        },
        {
            icon: "category",
            label: Localization.SPHERE,
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.SPHERE)
        },
        {
            icon: "category",
            label: Localization.PLANE,
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.PLANE)
        },
        {
            icon: "category",
            label: Localization.CYLINDER,
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.CYLINDER)
        },
        {divider: true, label: Localization.LIGHTS},
        {
            icon: "wb_iridescent",
            label: Localization.SPHERE_AREA,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.SPHERE)
        },
        {
            icon: "wb_iridescent",
            label: Localization.DISK_AREA,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.DISK)
        },
        {
            icon: "wb_iridescent",
            label: Localization.PLANE_AREA,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.PLANE)
        },


        {
            icon: "lightbulb",
            label: Localization.POINT_LIGHT,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.POINT)
        },
        {
            icon: "light_mode",
            label: Localization.DIRECTIONAL_LIGHT,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.DIRECTIONAL)
        },
        {
            icon: "highlight",
            label: Localization.SPOTLIGHT,
            onClick: () => EntityConstructor.createLight(LIGHT_TYPES.SPOT)
        },

        {
            icon: "lens_blur",
            label: Localization.SKYLIGHT,
            onClick: () => EntityConstructor.createProbe()
        },


        {divider: true, label: Localization.UTILS},
        {
            icon: "videocam",
            label: Localization.CAMERA,
            onClick: EntityConstructor.createCamera
        },

        {
            icon: "image",
            label: Localization.SPRITE,
            onClick: EntityConstructor.createSprite
        }
    ]
}