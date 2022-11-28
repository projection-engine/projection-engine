import SHADING_MODELS from "../../../../public/engine/static/SHADING_MODELS";

import SSAO from "../../../../public/engine/runtime/rendering/SSAO";
import SSGI from "../../../../public/engine/runtime/rendering/SSGI";

export default function getTexture(shadingModel) {

    switch (shadingModel) {
        case SHADING_MODELS.AO:
            return SSAO.filteredSampler
        case SHADING_MODELS.SSR:
            return SSGI.SSRSampler
        case SHADING_MODELS.SSGI:
            return SSGI.SSGISampler
        case SHADING_MODELS.SSGI_UNFILTERED:
            return SSGI.unfilteredSSGISampler
    }

}