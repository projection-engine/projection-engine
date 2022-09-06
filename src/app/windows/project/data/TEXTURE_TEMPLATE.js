import TEXTURE_FORMATS from "../libs/engine/production/data/texture/TEXTURE_FORMATS";
import TEXTURE_WRAPPING from "../libs/engine/production/data/texture/TEXTURE_WRAPPING";
import TEXTURE_FILTERING from "../libs/engine/production/data/texture/TEXTURE_FILTERING";

export default {
    base64: "",
    flipY: false,
    wrapS: TEXTURE_WRAPPING.REPEAT,
    wrapT: TEXTURE_WRAPPING.REPEAT,
    minFilter: TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_LINEAR,
    magFilter: TEXTURE_FILTERING.MAG.LINEAR,
    internalFormat: TEXTURE_FORMATS.SRGBA.internalFormat,
    format: TEXTURE_FORMATS.SRGBA.format,
}