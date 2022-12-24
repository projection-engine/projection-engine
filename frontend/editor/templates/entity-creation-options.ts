import EntityConstructor from "../lib/controllers/EntityConstructor";
import Localization from "../../static/LOCALIZATION_EN";
import LIGHT_TYPES from "../../../engine-core/static/LIGHT_TYPES";
import EmbeddedMeshes from "../../../engine-core/templates/EmbeddedMeshes";

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
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.CUBE)
        },
        {
            icon: "category",
            label: Localization.SPHERE,
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.SPHERE)
        },
        {
            icon: "category",
            label: Localization.PLANE,
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.PLANE)
        },
        {
            icon: "category",
            label: Localization.CYLINDER,
            onClick: () => EntityConstructor.createMesh(EmbeddedMeshes.CYLINDER)
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