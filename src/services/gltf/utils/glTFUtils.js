import {mat4, quat} from "gl-matrix";
import Transformation from "../../engine/utils/Transformation";
import ImageProcessor from "../../workers/ImageProcessor";
import randomID from "../../utils/misc/randomID";

const fs = window.require('fs')
const path = window.require('path')


export function materialParser(basePath, material, textures, images) {
    return new Promise(resolve => {
        // let materialObj = {
        //     name: ,
        //
        //     emissiveFactor: material.emissiveFactor,
        // }
        // TODO - EMISSIVE
        let promises = []


        if (material.pbrMetallicRoughness) {
            if (material.pbrMetallicRoughness.baseColorTexture)
                promises.push(loadTexture('albedo', basePath, material.pbrMetallicRoughness.baseColorTexture, textures, images))
            else if (material.pbrMetallicRoughness.baseColorFactor)
                promises.push(new Promise(resolve => resolve({
                    key: 'albedo',
                    data: ImageProcessor.colorToImage(material.pbrMetallicRoughness.baseColorFactor)
                })))

            if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
                promises.push(loadTexture('metallic', basePath, material.pbrMetallicRoughness.metallicRoughnessTexture, textures, images, [0, 0, 1, 1]))
                promises.push(loadTexture('roughness', basePath, material.pbrMetallicRoughness.metallicRoughnessTexture, textures, images, [0, 1, 0, 1]))
            } else {
                const m = material.pbrMetallicRoughness.metallicFactor,
                    r = material.pbrMetallicRoughness.roughnessFactor
                if (m)
                    promises.push(new Promise(resolve => resolve({
                        key: 'metallic',
                        data: ImageProcessor.colorToImage([m, m, m, 1])
                    })))
                if (r)
                    promises.push(new Promise(resolve => resolve({
                        key: 'roughness',
                        data: ImageProcessor.colorToImage([r, r, r, 1])
                    })))
            }
        }

        if (material.normalTexture)
            promises.push(loadTexture('normal', basePath, material.normalTexture, textures, images))

        if (material.occlusionTexture)
            promises.push(loadTexture('ao', basePath, material.occlusionTexture, textures, images, material.pbrMetallicRoughness.metallicRoughnessTexture?.index === material.occlusionTexture?.index ? [1, 0, 0, 1] : undefined))

        if (material.heightTexture)
            promises.push(loadTexture('height', basePath, material.heightTexture, textures, images))


        Promise.all(promises)
            .then(result => {
                let res = {}
                result.forEach(r => {
                    if (r.data)
                        switch (r.key) {
                            case 'albedo':
                                res.albedo = r.data
                                break
                            case 'metallic':
                                res.metallic = r.data
                                break
                            case 'roughness':
                                res.roughness = r.data
                                break
                            case 'normal':
                                res.normal = r.data
                                break
                            case 'ao':
                                res.ao = r.data
                                break
                            case 'height':
                                res.height = r.data
                                break
                            case 'emissive':
                                res.emissive = r.data
                                break
                        }
                })

                resolve({
                    name: material.name,

                    response: res,
                    id: randomID()
                })
            })

    })
}

function loadTexture(key, basePath, texture, textures, images, channels) {

    return new Promise(resolve => {
        const index = texture.index
        const source = index !== undefined ? textures[index] : undefined
        const imgURI = source !== undefined ? images[source.source] : undefined

        if (imgURI !== undefined) {
            let file
            console.log(imgURI.uri)
            if (typeof imgURI.uri === 'string' && imgURI.uri.includes('data:image'))
                file = imgURI.uri
            else {
                const resolved = path.resolve(basePath + '\\' + imgURI.uri)
                try {
                    file = fs.readFileSync(resolved, {encoding: 'base64'})
                } catch (e) {
                }
            }

            if (file) {
                file = `data:image/${imgURI.uri.split('.').pop()};base64, ` + file
                if (channels !== undefined && channels.length === 4)
                    ImageProcessor.extractChannel(channels, file)
                        .then(f => {
                            resolve({key, data: f})
                        })
                        .catch(() => resolve({key}))
                else
                    resolve({key, data: file})
            } else
                resolve({key})
        } else
            resolve({key})
    })

}

export function nodeParser(node, allNodes, parentTransform) {
    let res = []
    let children = node.children && node.children.length > 0 ? allNodes
            .map((n, index) => {
                if (node.children.includes(index))
                    return {...allNodes[index], index}
                else
                    return undefined
            }).filter(e => e !== undefined)
        :
        []


    let parsedNode = {
        name: node.name,
        meshIndex: node.mesh,
        scaling: [1, 1, 1],
        rotation: [0, 0, 0],
        translation: [0, 0, 0],
        children: []
    }

    if (node.matrix) {
        parsedNode = {
            ...parsedNode,
            ...extractTransformations(node.matrix)
        }
    } else {
        let translation = node.translation,
            rotation = node.rotation,
            scale = node.scale
        if (!translation)
            translation = [0, 0, 0]
        if (!scale)
            scale = [1, 1, 1]
        if (!rotation)
            rotation = [0, 0, 0, 1]


        parsedNode.scaling = scale
        parsedNode.rotation = quaternionToRotation(rotation)
        parsedNode.translation = translation

    }

    let transformationMatrix = Transformation.transform(parsedNode.translation, parsedNode.rotation, parsedNode.scaling)
    if (parentTransform) {
        mat4.multiply(
            transformationMatrix,
            parentTransform,
            transformationMatrix
        )
        parsedNode = {
            ...parsedNode,
            ...extractTransformations(transformationMatrix)
        }
    }
    children = children
        .map(child => {
            return nodeParser(child, allNodes, transformationMatrix)
        })
        .flat()

    res.push(...children)
    if (node.mesh !== undefined)
        res.push(parsedNode)
    return res
}


function extractTransformations(mat) {
    let translation = [0, 0, 0],
        rotation = [0, 0, 0, 1],
        scaling = [1, 1, 1]

    mat4.getTranslation(translation, mat)
    mat4.getRotation(rotation, mat)
    mat4.getScaling(scaling, mat)

    return {
        translation,
        rotation: quaternionToRotation(rotation),
        scaling
    }
}

function quaternionToRotation(rotation) {
    let x, y, z
    x = quat.getAxisAngle([1, 0, 0], rotation)
    y = quat.getAxisAngle([0, 1, 0], rotation)
    z = quat.getAxisAngle([0, 0, 1], rotation)

    return [x, y, z]
}


export function getPrimitives(mesh, materials = []) {
    const primitives = mesh.primitives;

    primitives.forEach(primitive => {
        primitive.attributes = Object.keys(primitive.attributes).map(name => ({
            name,
            index: primitive.attributes[name]
        }))

        if (typeof primitive.material !== "undefined") {
            primitive.material = materials[primitive.material];
        }
    });
    return primitives.map(p => {
        const vert = p.attributes.find(d => d.name === 'POSITION')
        const norm = p.attributes.find(d => d.name === 'NORMAL')
        const tang = p.attributes.find(d => d.name === 'TANGENT')
        const uv = p.attributes.find(d => d.name === 'TEXCOORD_0')

        return {
            indices: p.indices,
            vertices: vert ? vert.index : -1,
            tangents: tang ? tang.index : -1,
            normals: norm ? norm.index : -1,
            uvs: uv ? uv.index : -1,
            material: p.material
        }
    })
}
