import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";

export default function getEngineIcon(nodeRef): { icon: string, label: string }[] {
    let icons = []
    if (nodeRef) {

        if (nodeRef.skylightComponent)
            icons.push({
                icon: "lens_blur",
                label: LOCALIZATION_EN.SKYLIGHT
            })
        if (nodeRef.meshComponent)

            icons.push({
                icon: "category",
                label: LOCALIZATION_EN.MESH_RENDERER
            })
        if (nodeRef.cameraComponent)

            icons.push({
                icon: "videocam",
                label: LOCALIZATION_EN.CAMERA
            })
        if (nodeRef.spriteComponent)
            icons.push({
                icon: "image",
                label: LOCALIZATION_EN.SPRITE_RENDERER
            })
        if (nodeRef.uiComponent)
            icons.push({
                icon: "widgets",
                label: LOCALIZATION_EN.UI_LAYOUT
            })

        if (nodeRef.lightComponent)
            icons.push({
                icon: "light_mode",
                label: LOCALIZATION_EN.LIGHT
            })
    }
    return icons
}