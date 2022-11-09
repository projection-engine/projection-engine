import SHADING_MODELS from "../../../../public/engine/editor-environment/data/SHADING_MODELS";
import GBuffer from "../../../../public/engine/runtime/renderers/GBuffer";
import AmbientOcclusion from "../../../../public/engine/runtime/occlusion/AmbientOcclusion";
import GlobalIlluminationPass from "../../../../public/engine/runtime/GlobalIlluminationPass";

export default function getTexture(shadingModel) {

    switch (shadingModel) {
        case SHADING_MODELS.UV:
        case SHADING_MODELS.DEPTH:
            return GBuffer.depthUVSampler
        case SHADING_MODELS.AO:
            return AmbientOcclusion.filteredSampler
        case SHADING_MODELS.NORMAL:
            return GBuffer.normalSampler
        case SHADING_MODELS.ALBEDO:
            return GBuffer.albedoSampler
        case SHADING_MODELS.SSR:
            return GlobalIlluminationPass.SSRSampler
        case SHADING_MODELS.POSITION:
            return GBuffer.positionSampler
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
        case SHADING_MODELS.ID:
            return GBuffer.IDSampler
        case SHADING_MODELS.VELOCITY:
            return GBuffer.velocityMapSampler
    }

}