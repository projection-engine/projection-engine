import PathSep from "../../../static/PathSep"
import prepareMaterial from "./prepareMaterial"

const fs = require("fs")
const path = require("path")


export default async function parseMaterial(basePath, data, textures, images) {
    try{
        console.log(
            basePath, data, textures, images
        )
        const PBR = data.pbrMetallicRoughness
        const {
            baseColorFactor,
            baseColorTexture,
            metallicFactor,
            roughnessFactor,
            metallicRoughnessTexture,

            normalTexture,
            emissiveFactor,
            occlusionTexture,
            emissiveTexture
        } = {...PBR, data}

        const materialData = {
            emissive: 0,
            albedo: .5,
            normal: null,
            roughness: 1,
            metallic: 0,
            ao: 0
        }

        if (PBR) {
            if (baseColorTexture)
                materialData.albedo = await loadTexture("albedo", basePath, baseColorTexture, textures, images)
            else if (baseColorFactor)
                materialData.albedo = baseColorFactor
            if (metallicRoughnessTexture) {
                materialData.metallic = await loadTexture("metallic", basePath, metallicRoughnessTexture, textures, images, [0, 0, 1, 1])
                materialData.roughness = await loadTexture("roughness", basePath, metallicRoughnessTexture, textures, images, [0, 1, 0, 1])
            } else {
                if (metallicFactor !== undefined)
                    materialData.metallic = metallicFactor
                if (roughnessFactor !== undefined)
                    materialData.roughness = roughnessFactor
            }
        }
        if(emissiveFactor !== undefined)
            materialData.emissive = emissiveFactor
        if(emissiveTexture)
            materialData.emissive = await loadTexture("normal", basePath, normalTexture, textures, images)
        if (normalTexture)
            materialData.normal = await loadTexture("normal", basePath, normalTexture, textures, images)
        if (occlusionTexture)
            materialData.ao = await loadTexture("ao", basePath, occlusionTexture, textures, images, metallicRoughnessTexture?.index === occlusionTexture?.index ? [1, 0, 0, 1] : undefined)

        return await prepareMaterial(materialData)
    }catch (error){
        console.error(error)
    }
}

async function loadTexture(basePath, texture, textures, images) {
    const index = texture.index
    const source = index !== undefined ? textures[index] : undefined
    const imgURI = source !== undefined ? images[source.source] : undefined
    if (imgURI !== undefined) {
        let file
        if (typeof imgURI.uri === "string" && imgURI.uri.includes("data:image"))
            file = imgURI.uri
        else
            file = await new Promise(resolve => fs.readFile(path.resolve(basePath + PathSep.sep + imgURI.uri), {encoding: "base64"}, (_, data) => resolve(data)))
        if (file)
            return `data:image/${imgURI.uri.split(".").pop()};base64, ` + file
    }
}

