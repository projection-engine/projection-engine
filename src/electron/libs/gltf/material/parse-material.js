const loadTexture = require("./load-texture")
const writeData = require("../../../utils/gltf/write-data");
const path = require("path");
const getNormalizedName = require("../../../utils/gltf/get-normalized-name");
const FILE_TYPES = require("../../../../data/FILE_TYPES");
const PBR_MATERIAL = require("../../../../data/PBR_MATERIAL_SAMPLE.json")
const {v4} = require("uuid")
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
    const ID = v4()
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
                images.metallicRoughness = await getTexture(metallicRoughnessTexture, "metallic_roughness")
        }
        if (emissiveTexture)
            images.emissive = await getTexture(emissiveTexture, "emission")
        if (normalTexture)
            images.normal = await getTexture(normalTexture, "normals")
        if (occlusionTexture)
            images.ao = await getTexture(occlusionTexture, "occlusion")

        const newMaterial = {...PBR_MATERIAL}
        newMaterial.nodes = newMaterial.nodes.map(n => {
            if (n._texture != null) {
                let texture
                try{
                    switch (n.id) {
                        case "NORMAL": {
                            texture = images.normal
                            let index = newMaterial.response.uniforms.findIndex(v => v.value === "NORMAL-SAMPLER")
                            newMaterial.response.uniforms[index].value = texture

                            index = newMaterial.response.uniformData.findIndex(v => v.data === "NORMAL-SAMPLER")
                            newMaterial.response.uniformData[index].data = texture
                            break
                        }
                        case "METALLIC-ROUGHNESS": {
                            texture = images.metallicRoughness
                            let index = newMaterial.response.uniforms.findIndex(v => v.value === "METALLIC-ROUGHNESS-SAMPLER")
                            newMaterial.response.uniforms[index].value = texture

                            index = newMaterial.response.uniformData.findIndex(v => v.data === "METALLIC-ROUGHNESS-SAMPLER")
                            newMaterial.response.uniformData[index].data = texture
                            break
                        }
                        case "ALBEDO": {
                            texture = images.albedo
                            let index = newMaterial.response.uniforms.findIndex(v => v.value === "ALBEDO-SAMPLER")
                            newMaterial.response.uniforms[index].value = texture

                            index = newMaterial.response.uniformData.findIndex(v => v.data === "ALBEDO-SAMPLER")
                            console.log(index)
                            newMaterial.response.uniformData[index].data = texture
                            break
                        }
                        default:
                            break
                    }
                }catch (err){
                    console.error(err)
                }
                n._texture.registryID = texture
                n.texture.registryID = texture

            }
            return n
        })
        console.log(newMaterial.response.uniforms)
        return newMaterial
    } catch (error) {
        console.error(error)
    }
}
