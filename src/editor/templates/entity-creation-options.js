import STATIC_MESHES from "../../../public/engine/static/resources/STATIC_MESHES";
import EntityConstructor from "../libs/EntityConstructor";
import Localization from "../../shared/libs/Localization";

const translate = key => Localization.PROJECT.VIEWPORT[key]
export default function entityCreationOptions() {
    return [
        {
            icon: "category",
            label: translate("EMPTY_ENTITY"),
            onClick: EntityConstructor.createEmpty
        },
        {divider: true, label: translate("MESHES")},
        {
            icon: "category",
            label: translate("CUBE"),
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.CUBE)
        },
        {
            icon: "category",
            label: translate("SPHERE"),
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.SPHERE)
        },
        {
            icon: "category",
            label: translate("PLANE"),
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.PLANE)
        },
        {
            icon: "category",
            label: translate("CYLINDER"),
            onClick: () => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.CYLINDER)
        },
        {divider: true, label: translate("LIGHTS")},
        {
            icon: "lightbulb",
            label: translate("POINT_LIGHT"),
            onClick: EntityConstructor.createPointLight
        },
        {
            icon: "light_mode",
            label: translate("DIRECTIONAL_LIGHT"),
            onClick: EntityConstructor.createDirectionalLight
        },
        {divider: true, label: translate("AMBIENT")},

        {
            icon: "lens_blur",
            label: translate("SPECULAR_PROBE"),
            onClick: () => EntityConstructor.createProbe(false)
        },
        {
            icon: "lens_blur",
            label: translate("DIFFUSE_PROBE"),
            onClick: () => EntityConstructor.createProbe(true)
        },
        {divider: true, label: translate("UTILS")},
        {
            icon: "videocam",
            label: translate("CAMERA"),
            onClick: EntityConstructor.createCamera
        },

        {
            icon: "image",
            label: translate("SPRITE"),
            onClick: EntityConstructor.createSprite
        }
    ]
}