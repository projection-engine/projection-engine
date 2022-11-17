import MATERIAL_RENDERING_TYPES from "../../../../../../public/engine/static/MATERIAL_RENDERING_TYPES";
import {vertex} from "../../../../../../public/engine/shaders/SKYBOX.glsl";
import TEMPLATE_VERTEX_SHADER from "../../../../../../public/engine/shaders/DEFAULT_MATERIAL.vert";

export default function getVertexShader(type) {
    if(type === MATERIAL_RENDERING_TYPES.SKYBOX)
        return vertex
    return TEMPLATE_VERTEX_SHADER
}
