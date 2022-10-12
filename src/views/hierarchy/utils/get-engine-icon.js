import COMPONENTS from "../../../../public/engine/static/COMPONENTS.json";

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
        if (nodeRef.components.get(COMPONENTS.PROBE))
            icons.push({
                icon: "lens_blur",
                label: "Probe"
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