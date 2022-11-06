import SIMPLE_MATERIAL_UNIFORMS from "../../../../engine/static/SIMPLE_MATERIAL_UNIFORMS";
import TEXTURE_FORMATS from "../../../../engine/static/texture/TEXTURE_FORMATS";

export default async function buildMaterial(textures, imagesMap, material, textureMap) {
    const copy = {...SIMPLE_MATERIAL_UNIFORMS}
    const settings = copy.uniformData[0]
    const rgbSamplerScales = copy.uniformData[1]
    const fallbackValues = copy.uniformData[3]
    const linearSamplerScales = copy.uniformData[2]
    const albedo = copy.uniformData[5]
    const normal = copy.uniformData[6]
    const roughness = copy.uniformData[7]
    const metallic = copy.uniformData[8]
    const ao = copy.uniformData[9]
    const emission = copy.uniformData[10]

    try {

        const PBR = material.pbrMetallicRoughness
        const {
            baseColorTexture,
            metallicRoughnessTexture,
            normalTexture,
            occlusionTexture,
            emissiveTexture,
            baseColorFactor,
            metallicFactor,
            roughnessFactor,
            emissiveFactor
        } = PBR ? {...PBR, ...material} : material
        if (PBR) {
            if (baseColorTexture) {
                settings.data[0] = 1
                albedo.data = imagesMap[textures[baseColorTexture.index].source]

                if (textureMap[albedo.data] != null) {
                    textureMap[albedo.data].internalFormat = TEXTURE_FORMATS.SRGBA.internalFormat
                    textureMap[albedo.data].format = TEXTURE_FORMATS.SRGBA.format
                    textureMap[albedo.data].type = TEXTURE_FORMATS.SRGBA.type
                }
            }

            if (baseColorFactor != null) {
                if (settings.data[0] === 1) {
                    rgbSamplerScales.data[0] = baseColorFactor[0]
                    rgbSamplerScales.data[1] = baseColorFactor[1]
                    rgbSamplerScales.data[2] = baseColorFactor[2]
                } else {
                    fallbackValues.data[0] = baseColorFactor[0]
                    fallbackValues.data[1] = baseColorFactor[1]
                    fallbackValues.data[2] = baseColorFactor[2]
                }
            }


            if (metallicRoughnessTexture) {
                settings.data[3] = 1
                settings.data[2] = 1
                roughness.data = metallic.data = imagesMap[textures[metallicRoughnessTexture.index].source]
                // R channel for metallic
                linearSamplerScales.data[4] = 0
                linearSamplerScales.data[5] = 0

                // G channel for roughness
                linearSamplerScales.data[6] = 0
                linearSamplerScales.data[8] = 0

            }
            if (metallicFactor != null) {
                settings.data[3] = 0
                fallbackValues.data[7] = metallicFactor
            }

            if (roughnessFactor != null) {
                settings.data[2] = 0
                fallbackValues.data[6] = roughnessFactor
            }
        }
        if (emissiveTexture) {
            settings.data[5] = 1
            emission.data = imagesMap[textures[emissiveTexture.index].source]
        }

        // if (emissiveFactor != null) {
        //     settings.data[5] = 0
        //     fallbackValues.data[3] = emissiveFactor[0]
        //     fallbackValues.data[4] = emissiveFactor[1]
        //     fallbackValues.data[5] = emissiveFactor[2]
        // }

        if (normalTexture) {
            settings.data[1] = 1
            normal.data = imagesMap[textures[normalTexture.index].source]
            if (normalTexture.scale != null) {
                rgbSamplerScales.data[3] = normalTexture.scale
                rgbSamplerScales.data[4] = normalTexture.scale
                rgbSamplerScales.data[5] = normalTexture.scale
            }
        }
        if (occlusionTexture) {
            settings.data[6] = 1

            ao.data = imagesMap[textures[occlusionTexture.index].source]
            if (roughness.data === ao.data) {
                // B channel for ambient occlusion
                linearSamplerScales.data[0] = 0
                linearSamplerScales.data[1] = 0
            }
        }

        return copy
    } catch (error) {
        console.error(error)
    }
}
