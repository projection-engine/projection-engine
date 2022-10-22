
import loadTexture from "./load-texture";
import SIMPLE_MATERIAL_UNIFORMS from "../../../../engine/templates/materials/simple/SIMPLE_MATERIAL_UNIFORMS";


export default async function parseMaterial(basePath, data, textures, images, partialPath, projectPath, index) {
    const getTexture = (sampler, name) => loadTexture(
        basePath,
        sampler,
        textures,
        images,
        partialPath,
        projectPath,
        name,
        index
    )
    if(!data)
        return

    const settings = SIMPLE_MATERIAL_UNIFORMS.uniformData[0]
    const rgbSamplerScales = SIMPLE_MATERIAL_UNIFORMS.uniformData[1]
    const fallbackValues = SIMPLE_MATERIAL_UNIFORMS.uniformData[2]
    const albedo = SIMPLE_MATERIAL_UNIFORMS.uniformData[3]
    const normal = SIMPLE_MATERIAL_UNIFORMS.uniformData[4]
    const roughness = SIMPLE_MATERIAL_UNIFORMS.uniformData[5]
    const metallic = SIMPLE_MATERIAL_UNIFORMS.uniformData[6]
    const ao = SIMPLE_MATERIAL_UNIFORMS.uniformData[7]
    const emission = SIMPLE_MATERIAL_UNIFORMS.uniformData[8]
    const copy = {...SIMPLE_MATERIAL_UNIFORMS}

    try {

        const PBR = data.pbrMetallicRoughness
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
        } = PBR ? {...PBR, ...data} : data
        if (PBR) {
            if (baseColorTexture) {
                settings.data[0] = 1
                albedo.data = await getTexture(baseColorTexture, "albedo")
            }

            if (baseColorFactor != null) {
                if(settings.data[0] === 1) {
                    rgbSamplerScales.data[0] = baseColorFactor[0]
                    rgbSamplerScales.data[1] = baseColorFactor[1]
                    rgbSamplerScales.data[2] = baseColorFactor[2]
                }
                else {
                    fallbackValues.data[0] = baseColorFactor[0]
                    fallbackValues.data[1] = baseColorFactor[1]
                    fallbackValues.data[2] = baseColorFactor[2]
                }
            }


            if (metallicRoughnessTexture) {
                settings.data[3] =  1
                metallic.data = await getTexture(metallicRoughnessTexture, "metallic_roughness")
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
            emission.data = await getTexture(emissiveTexture, "emission")
        }

        if (emissiveFactor != null) {
            settings.data[5] = 0
            fallbackValues.data[3] = emissiveFactor[0]
            fallbackValues.data[4] = emissiveFactor[1]
            fallbackValues.data[5] = emissiveFactor[2]
        }

        if (normalTexture) {
            settings.data[1] = 1
            normal.data = await getTexture(normalTexture, "normals")
            if (normalTexture.scale != null) {
                rgbSamplerScales.data[3] = normalTexture.scale
                rgbSamplerScales.data[4] = normalTexture.scale
                rgbSamplerScales.data[5] = normalTexture.scale
            }
        }
        if (occlusionTexture) {
            settings.data[6] = 1
            ao.data = await getTexture(occlusionTexture, "occlusion")
        }


        copy.uniformData[0] = settings
        copy.uniformData[1] = rgbSamplerScales
        copy.uniformData[2] = fallbackValues
        copy.uniformData[3] = albedo
        copy.uniformData[4] = normal
        copy.uniformData[5] = roughness
        copy.uniformData[6] = metallic
        copy.uniformData[7] = ao
        copy.uniformData[8] = emission

        return copy
    } catch (error) {
        console.error(error)
    }
}
