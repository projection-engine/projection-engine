import COMPONENTS from "../../../../../../public/engine/production/data/COMPONENTS";

export default function getEngineIcon(nodeRef){
    if (nodeRef) {
        if (nodeRef.components[COMPONENTS.POINT_LIGHT])
            return "lightbulb"
        if (nodeRef.components[COMPONENTS.DIRECTIONAL_LIGHT])
            return "light_mode"
        if (nodeRef.components[COMPONENTS.PROBE])
            return "lens_blur"
        if (nodeRef.components[COMPONENTS.MESH])
            return "category"
        if (nodeRef.components[COMPONENTS.CAMERA])
            return "videocam"
        if (nodeRef.components[COMPONENTS.SPRITE])
            return "image"
        return "inventory_2"
    }
}