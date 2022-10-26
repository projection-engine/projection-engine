import STATIC_MESHES from "../../public/engine/static/resources/STATIC_MESHES";
import EntityConstructor from "../libs/EntityConstructor";
import Localization from "./Localization";

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
        {divider: true, label: Localization.AMBIENT},

        {
            icon: "lens_blur",
            label: Localization.SPECULAR_PROBE,
            onClick: () => EntityConstructor.createProbe(false)
        },
        {
            icon: "lens_blur",
            label: Localization.DIFFUSE_PROBE,
            onClick: () => EntityConstructor.createProbe(true)
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