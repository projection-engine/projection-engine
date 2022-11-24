import SHADING_MODELS from "../../../lib/engine-tools/static/SHADING_MODELS";

import AmbientOcclusion from "../../../../public/engine/runtime/occlusion/AmbientOcclusion";
import GlobalIlluminationPass from "../../../../public/engine/runtime/rendering/GlobalIlluminationPass";

export default function getTexture(shadingModel) {

    switch (shadingModel) {
        case SHADING_MODELS.AO:
            return AmbientOcclusion.filteredSampler
        case SHADING_MODELS.SSR:
            return GlobalIlluminationPass.SSRSampler
        case SHADING_MODELS.SSGI:
            return GlobalIlluminationPass.SSGISampler
        case SHADING_MODELS.SSGI_UNFILTERED:
            return GlobalIlluminationPass.unfilteredSSGISampler
    }

}