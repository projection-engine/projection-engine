import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS";

export default function getLabel(shadingModel){
    switch (shadingModel) {
        case SHADING_MODELS.LIGHT_ONLY:
            return "SHADING_LIGHT"
        case SHADING_MODELS.ALBEDO:
            return "SHADING_UNLIT"
        case SHADING_MODELS.NORMAL:
            return "SHADING_NORMAL"
        case SHADING_MODELS.DEPTH:
            return "SHADING_DEPTH"
        case SHADING_MODELS.G_AO:
        case SHADING_MODELS.AO:
            return "SHADING_AO"
        case SHADING_MODELS.RANDOM:
            return  "SHADING_RANDOM"
        case SHADING_MODELS.POSITION:
            return  "POSITION"
        case SHADING_MODELS.DETAIL:
            return "SHADING_DETAIL"
        case SHADING_MODELS.ROUGHNESS:
            return "SHADING_ROUGHNESS"
        case SHADING_MODELS.METALLIC:
            return "SHADING_METALLIC"
        case SHADING_MODELS.LIGHT_COMPLEXITY:
            return "LIGHT_COMPLEXITY"
        case SHADING_MODELS.UV:
            return "SHADING_UV"
        case SHADING_MODELS.OVERDRAW:
            return "OVERDRAW"
        case SHADING_MODELS.LIGHT_QUANTITY:
            return "LIGHT_QUANTITY"
        default:
            return ""
    }
}