const loadTexture = require("./load-texture")

module.exports = async function parseMaterial(basePath, data, textures, images, partialPath, projectPath, index) {
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

    try {
        const images = {
            ao: undefined,
            albedo: undefined,
            metallic: undefined,
            roughness: undefined,
            normal: undefined,
            emissive: undefined
        }
        const PBR = data.pbrMetallicRoughness
        const {
            baseColorTexture,
            metallicRoughnessTexture,
            normalTexture,
            occlusionTexture,
            emissiveTexture
        } = PBR ? {...PBR, ...data} : data
        if (PBR) {
            if (baseColorTexture)
                images.albedo = await getTexture(baseColorTexture, "albedo")
            if (metallicRoughnessTexture)
                images.metallic = images.roughness = await getTexture(metallicRoughnessTexture, "metallic_roughness")
        }
        if (emissiveTexture)
            images.emissive = await getTexture(emissiveTexture, "emission")
        if (normalTexture)
            images.normal = await getTexture(normalTexture, "normals")
        if (occlusionTexture)
            images.ao = await getTexture(occlusionTexture, "occlusion")

    } catch (error) {
        console.error(error)
    }
}
