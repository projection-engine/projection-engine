import COMPONENTS from "../../../../../engine-core/static/COMPONENTS.js";
import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";

export default function getEngineIcon(nodeRef) {
    let icons = []
    if (nodeRef) {

        if (nodeRef.components.get(COMPONENTS.SKYLIGHT))
            icons.push({
                icon: "lens_blur",
                label: LOCALIZATION_EN.SKYLIGHT
            })
        if (nodeRef.components.get(COMPONENTS.MESH))

            icons.push({
                icon: "category",
                label: LOCALIZATION_EN.MESH_RENDERER
            })
        if (nodeRef.components.get(COMPONENTS.CAMERA))

            icons.push({
                icon: "videocam",
                label: LOCALIZATION_EN.CAMERA
            })
        if (nodeRef.components.get(COMPONENTS.SPRITE))
            icons.push({
                icon: "image",
                label: LOCALIZATION_EN.SPRITE_RENDERER
            })
        if (nodeRef.components.get(COMPONENTS.UI))
            icons.push({
                icon: "widgets",
                label: LOCALIZATION_EN.UI_LAYOUT
            })

        if ( nodeRef.__hasLight)
            icons.push({
                icon: "light_mode",
                label: LOCALIZATION_EN.LIGHT
            })
    }
    return icons
}