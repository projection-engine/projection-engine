import COMPONENTS from "../../../../../../public/engine/static/COMPONENTS";

export default function getEngineIcon(nodeRef){
    if (nodeRef) {
        if (nodeRef.components.get(COMPONENTS.POINT_LIGHT))
            return "lightbulb"
        if (nodeRef.components.get(COMPONENTS.DIRECTIONAL_LIGHT))
            return "light_mode"
        if (nodeRef.components.get(COMPONENTS.PROBE))
            return "lens_blur"
        if (nodeRef.components.get(COMPONENTS.MESH))
            return "category"
        if (nodeRef.components.get(COMPONENTS.CAMERA))
            return "videocam"
        if (nodeRef.components.get(COMPONENTS.SPRITE))
            return "image"
        return "inventory_2"
    }
}