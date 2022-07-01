import PathSep from "../../../static/PathSep"
import Node, {getNormalizedName} from "../instances/Node"
import prepareMaterial from "./prepareMaterial"
import {v4} from "uuid"
import FILE_TYPES from "../../../static/FILE_TYPES"

const fs = require("fs")
const path = require("path")


export default async function parseMaterial(basePath, data, textures, images, partialPath, projectPath) {
    try{
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
        } = PBR ? {...PBR, ...data} : data
        console.log(PBR)
        const materialData = {
            emissive: 0,
            albedo: .5,
            roughness: 1,
            metallic: 0,
            ao: 0
        }

        if (PBR) {
            if (baseColorTexture)
                materialData.albedo = await loadTexture(basePath, baseColorTexture, textures, images, partialPath, projectPath)
            else if (baseColorFactor)
                materialData.albedo = baseColorFactor
            if (metallicRoughnessTexture) {
                materialData.metallic = await loadTexture( basePath, metallicRoughnessTexture, textures, images, partialPath, projectPath)
                materialData.roughness = await loadTexture(basePath, metallicRoughnessTexture, textures, images,  partialPath, projectPath)
            } else {
                if (metallicFactor !== undefined)
                    materialData.metallic = metallicFactor
                if (roughnessFactor !== undefined)
                    materialData.roughness = roughnessFactor
            }
        }
        // if(emissiveFactor !== undefined)
        //     materialData.emissive = emissiveFactor
        if(emissiveTexture)
            materialData.emissive = await loadTexture(basePath, normalTexture, textures, images, partialPath, projectPath)
        if (normalTexture)
            materialData.normal = await loadTexture(basePath, normalTexture, textures, images, partialPath, projectPath)
        if (occlusionTexture)
            materialData.ao = await loadTexture( basePath, occlusionTexture, textures, images, partialPath, projectPath)

        return await prepareMaterial(materialData)
    }catch (error){
        console.error(error)
    }
}

async function loadTexture(basePath, texture, textures, images, partialPath, projectPath) {
    const source = texture.index !== undefined ? textures[texture.index] : undefined
    const imgURI = source !== undefined ? images[source.source] : undefined

    if (imgURI !== undefined) {
        let file, fetched = false

        if (typeof imgURI.uri === "string" && imgURI.uri.includes("data:image"))
            file = imgURI.uri
        else {
            file = await new Promise(resolve => fs.readFile(path.resolve(basePath + PathSep.sep + imgURI.uri), {encoding: "base64"}, (_, data) => resolve(data)))
            fetched = true
        }
        if (file) {
            const imageBase64 =fetched ?  `data:image/${imgURI.uri.split(".").pop()};base64, ` + file : "data:image/png;base64, " + file
            const id = v4().toString()

            await Node.writeData(path.resolve(partialPath + getNormalizedName(id) + FILE_TYPES.IMAGE), imageBase64, id, projectPath, imageBase64)
            return {base64: imageBase64, id}
        }
    }
}

