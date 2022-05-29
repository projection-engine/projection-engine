import PathSep from "../../../PathSep";

const fs = require('fs')
const path = require('path')


export default async function parseMaterial(basePath, data, textures, images) {

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
    let promises = []
    if (PBR) {
        if (baseColorTexture)
            promises.push(loadTexture('albedo', basePath, baseColorTexture, textures, images))
        else if (baseColorFactor)
            promises.push(new Promise(async resolve => resolve({
                key: 'albedo',
                data: baseColorFactor
            })))

        if (metallicRoughnessTexture) {
            promises.push(loadTexture('metallic', basePath, metallicRoughnessTexture, textures, images, [0, 0, 1, 1]))
            promises.push(loadTexture('roughness', basePath, metallicRoughnessTexture, textures, images, [0, 1, 0, 1]))
        } else {
            const m = metallicFactor,
                r = roughnessFactor
            if (m)
                promises.push(new Promise(async resolve => resolve({
                    key: 'metallic',
                    data: m
                })))
            if (r)
                promises.push(new Promise(async resolve => resolve({
                    key: 'roughness',
                    data: m
                })))
        }
    }

    if (normalTexture)
        promises.push(loadTexture('normal', basePath, normalTexture, textures, images))
    if (occlusionTexture)
        promises.push(loadTexture('ao', basePath, occlusionTexture, textures, images, metallicRoughnessTexture?.index === occlusionTexture?.index ? [1, 0, 0, 1] : undefined))


    // return await Promise.all(promises)
    return []
}

async function loadTexture(key, basePath, texture, textures, images) {
    const index = texture.index
    const source = index !== undefined ? textures[index] : undefined
    const imgURI = source !== undefined ? images[source.source] : undefined
    if (imgURI !== undefined) {
        let file
        if (typeof imgURI.uri === 'string' && imgURI.uri.includes('data:image'))
            file = imgURI.uri
        else
            file = await new Promise(resolve => fs.readFile(path.resolve(basePath + PathSep.sep +  imgURI.uri), {encoding: 'base64'}, (_, data) => resolve(data)))
        if (file) {
            return {key, data: `data:image/${imgURI.uri.split('.').pop()};base64, ` + file}
        } else
            return {key}
    } else
        return {key}

}

