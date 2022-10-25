import SIMPLE_MATERIAL_UNIFORMS from "../../../../engine/static/SIMPLE_MATERIAL_UNIFORMS";

export default async function buildMaterial(textures, imagesMap, material) {
    const copy = {...SIMPLE_MATERIAL_UNIFORMS}
    const settings =         copy.uniformData[0]
    const rgbSamplerScales = copy.uniformData[1]
    const fallbackValues =   copy.uniformData[3]
    const albedo =           copy.uniformData[5]
    const normal =           copy.uniformData[6]
    const roughness =        copy.uniformData[7]
    const metallic =         copy.uniformData[8]
    const ao =               copy.uniformData[9]
    const emission =        copy.uniformData[10]

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
                metallic.data = imagesMap[textures[metallicRoughnessTexture.index].source]
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

        if (emissiveFactor != null) {
            settings.data[5] = 0
            fallbackValues.data[3] = emissiveFactor[0]
            fallbackValues.data[4] = emissiveFactor[1]
            fallbackValues.data[5] = emissiveFactor[2]
        }

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
        }

        return copy
    } catch (error) {
        console.error(error)
    }
}
