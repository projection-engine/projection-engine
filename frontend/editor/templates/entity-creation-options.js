import STATIC_MESHES from "../../../public/engine/static/resources/STATIC_MESHES";
import EntityConstructor from "../lib/controllers/EntityConstructor";
import Localization from "./LOCALIZATION_EN";

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
            icon: "lightbulb",
            label: Localization.POINT_LIGHT,
            onClick: EntityConstructor.createPointLight
        },
        {
            icon: "light_mode",
            label: Localization.DIRECTIONAL_LIGHT,
            onClick: EntityConstructor.createDirectionalLight
        },
        {
            icon: "lens_blur",
            label: Localization.SKYLIGHT,
            onClick: () => EntityConstructor.createProbe()
        },
        {
            icon: "highlight",
            label: Localization.SPOTLIGHT,
            onClick: EntityConstructor.createSpotLight
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