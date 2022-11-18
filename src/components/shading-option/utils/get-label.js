import SHADING_MODELS from "../../../lib/engine-tools/static/SHADING_MODELS";

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
        case SHADING_MODELS.SSR:
            return "SHADING_SSR"
        case SHADING_MODELS.POSITION:
            return "SHADING_POSITION"
        case SHADING_MODELS.RANDOM:
            return  "SHADING_RANDOM"
        case SHADING_MODELS.DETAIL:
            return "SHADING_DETAIL"
        case SHADING_MODELS.ROUGHNESS:
            return "SHADING_ROUGHNESS"
        case SHADING_MODELS.METALLIC:
            return "SHADING_METALLIC"
        case SHADING_MODELS.SSGI:
            return "SHADING_SSGI"
        case SHADING_MODELS.SSGI_UNFILTERED:
            return "SHADING_SSGI"
        case SHADING_MODELS.STOCHASTIC:
            return "SHADING_STOCHASTIC"
        case SHADING_MODELS.UV:
            return "SHADING_UV"
        case SHADING_MODELS.ID:
            return "SHADING_ID"
        case SHADING_MODELS.VELOCITY:
            return "SHADING_VELOCITY"
        default:
            return ""
    }
}