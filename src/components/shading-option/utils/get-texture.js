import SHADING_MODELS from "../../../lib/engine-tools/static/SHADING_MODELS";
import GBuffer from "../../../../public/engine/runtime/rendering/GBuffer";
import AmbientOcclusion from "../../../../public/engine/runtime/occlusion/AmbientOcclusion";
import GlobalIlluminationPass from "../../../../public/engine/runtime/rendering/GlobalIlluminationPass";
import VisibilityBuffer from "../../../../public/engine/runtime/rendering/VisibilityBuffer";

export default function getTexture(shadingModel) {

    switch (shadingModel) {
        case SHADING_MODELS.DEPTH:
            return VisibilityBuffer.positionSampler
        case SHADING_MODELS.AO:
            return AmbientOcclusion.filteredSampler
        case SHADING_MODELS.NORMAL:
            return VisibilityBuffer.normalSampler
        case SHADING_MODELS.ALBEDO:
            return GBuffer.albedoSampler
        case SHADING_MODELS.SSR:
            return GlobalIlluminationPass.SSRSampler
        case SHADING_MODELS.RANDOM:
            return VisibilityBuffer.entityIDSampler
        case SHADING_MODELS.POSITION:
            return VisibilityBuffer.positionSampler
        case SHADING_MODELS.G_AO:
        case SHADING_MODELS.ROUGHNESS:
        case SHADING_MODELS.METALLIC:
            return GBuffer.behaviourSampler
        case SHADING_MODELS.SSGI:
            return GlobalIlluminationPass.SSGISampler
        case SHADING_MODELS.SSGI_UNFILTERED:
            return GlobalIlluminationPass.unfilteredSSGISampler
        case SHADING_MODELS.STOCHASTIC:
            return GlobalIlluminationPass.normalSampler
    }

}