import COMPONENTS from "../../../../public/engine/static/COMPONENTS.js";
import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";

export default function getEngineIcon(nodeRef) {
    let icons = []
    if (nodeRef) {
        if (nodeRef.components.get(COMPONENTS.POINT_LIGHT))
            icons.push({
                icon: "lightbulb",
                label: "Point light"
            })
        if (nodeRef.components.get(COMPONENTS.DIRECTIONAL_LIGHT))
            icons.push({
                icon: "light_mode",
                label: "Directional light"
            })
        if (nodeRef.components.get(COMPONENTS.SKYLIGHT))
            icons.push({
                icon: "lens_blur",
                label: LOCALIZATION_EN.SKYLIGHT
            })
        if (nodeRef.components.get(COMPONENTS.MESH))

            icons.push({
                icon: "category",
                label: "Mesh renderer"
            })
        if (nodeRef.components.get(COMPONENTS.CAMERA))

            icons.push({
                icon: "videocam",
                label: "Camera"
            })
        if (nodeRef.components.get(COMPONENTS.SPRITE))
            icons.push({
                icon: "image",
                label: "Sprite"
            })
        if (nodeRef.components.get(COMPONENTS.UI))
            icons.push({
                icon: "widgets",
                label: "UI renderer"
            })
    }
    return icons
}