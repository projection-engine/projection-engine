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
                 await getTexture(baseColorTexture, "albedo")
            if (metallicRoughnessTexture)
                await getTexture(metallicRoughnessTexture, "metallic_roughness")
        }
        if (emissiveTexture)
            await getTexture(emissiveTexture, "emission")
        if (normalTexture)
            await getTexture(normalTexture, "normals")
        if (occlusionTexture)
            await getTexture(occlusionTexture, "occlusion")
    } catch (error) {
        console.error(error)
    }
}
