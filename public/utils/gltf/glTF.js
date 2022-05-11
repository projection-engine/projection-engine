import Buffer from "./Buffer";
import Accessor from "./Accessor";
import PrimitiveProcessor from "./PrimitiveProcessor";
import groupInto from "./utils/groupInto";
import parseNode from "./utils/parseNode";
import getPrimitives from "./utils/getPrimitive";
import parseMaterial from "./utils/parseMaterial";


const fs = require('fs')
const path = require('path')

export default async function glTF(newRoot, file, options, createRegistryEntry, pathName, filePath, fileName) {
    try {
        fs.mkdirSync(path.resolve(newRoot))
    } catch (e) {
    }
    const {nodes, materials} = await parseGLTF(file, filePath.replace(fileName, ''), options)
    let promises = []

    if (nodes)
        promises.push(...nodes.map(d => {
            const filePathLocal = newRoot.replace(pathName + '\\assets\\', '') + `\\${d.name}.mesh`

            if(!fs.existsSync(newRoot + `\\${d.name}.mesh`))
                return [
                    new Promise(r => {
                        fs.writeFile(
                            path.resolve(newRoot + `\\${d.name}.mesh`),
                            JSON.stringify(d.data),
                            (err) => {
                                console.log(err)
                                r()
                            });
                    }),
                    createRegistryEntry(filePathLocal)
                ]
            else
                return []
        }))


    // if (materials && materials.length > 0) {
    //     fs.mkdir(resolvePath(newRoot + `\\Materials`), () => {
    //         fs.mkdir(resolvePath(newRoot + `\\Materials\\Resources`), () => {
    //             promises.push(...materials.map(d => {
    //                 let parsedData = {...emptyMaterial}
    //                 const keysOnRes = Object.keys(d.response)
    //                 parsedData.nodes = parsedData.nodes.filter(n => {
    //                     return keysOnRes.includes(n.id) || n.id === 'material'
    //                 })
    //                 parsedData.links = parsedData.links.filter(e => {
    //                     return keysOnRes.includes(e.target.attribute.key)
    //                 })
    //                 parsedData.nodes = parsedData.nodes.map(n => {
    //                     const newNode = {...n}
    //                     newNode.sample = {
    //                         type: n.id,
    //                         registryID: uuidv4()
    //                     }
    //                     return newNode
    //                 })
    //                 parsedData.response = d.response
    //                 parsedData.response.name = d.name
    //
    //                 let localPromises = [
    //                     new Promise(r => {
    //                         fs.writeFile(
    //                             resolvePath(newRoot + `\\Materials\\${d.name}.material`),
    //                             JSON.stringify(parsedData),
    //                             () => {
    //                                 r()
    //                             });
    //                     }),
    //                     createRegistryEntry(d.id, newRoot.replace(path + '\\assets\\', '') + `\\Materials\\${d.name}.material`)
    //                 ]
    //
    //                 parsedData.nodes.forEach((n, i) => {
    //                     let nameSplit = n.sample.registryID
    //                     nameSplit = nameSplit.substr(0, nameSplit.length / 2)
    //                     localPromises.push(...importImage(newRoot + '\\Materials\\Resources\\' + nameSplit, d.response[n.sample.type]?.high, n.sample.registryID))
    //                 })
    //
    //                 return localPromises
    //             }))
    //         })
    //     })
    // }
    await Promise.all(promises)
}

async function parseGLTF(data, basePath, options) {
    try {
        let parsed = JSON.parse(data)
        const buffers = parsed.buffers.map(b => {
            return new Buffer(b, basePath)
        })
        await Promise.all(buffers.map(b => b.initialize()))
        parsed.buffers = null
        const accessors = parsed.accessors.map(a => new Accessor(a, buffers, parsed.bufferViews))
        const mainScene = parsed.scenes[0]
        let sceneNodes = parsed.nodes
            .map((n, index) => {
                if (mainScene.nodes.includes(index))
                    return {...parsed.nodes[index], index}
                else
                    return undefined
            })
            .filter(e => e !== undefined)
            .map(n => parseNode(n, parsed.nodes))
            .flat()

        parsed = {
            materials: parsed.materials,
            meshes: parsed.meshes,
            textures: parsed.textures,
            images: parsed.images
        }
        const parsedMaterials = await Promise.all(parsed.materials ? parsed.materials.map(m => parseMaterial(basePath, m, parsed.textures, parsed.images)) : [])
        let meshes = parsed.meshes.filter((_, index) => {
            return sceneNodes.find(n => n.meshIndex === index) !== undefined
        }).map(m => getPrimitives(m, parsed.materials)[0])

        let files = []
        sceneNodes.forEach(m => {
            const [min, max] = computeBoundingBox(accessors[meshes[m.meshIndex]?.vertices].data)
            const currentMesh = meshes[m.meshIndex]
            const normals = !options.keepNormals || (currentMesh.normals === -1 || currentMesh.normals === undefined) ? PrimitiveProcessor.computeNormals(accessors[currentMesh.indices]?.data, accessors[currentMesh.vertices]?.data) : accessors[currentMesh.normals].data
            const tangents = !options.keepTangents || (currentMesh.tangents === -1 || currentMesh.tangents === undefined) ? PrimitiveProcessor.computeTangents(accessors[currentMesh.indices]?.data, accessors[currentMesh.vertices]?.data, accessors[currentMesh.uvs]?.data, normals) : accessors[currentMesh.tangents].data
            files.push({
                name: m.name,
                data: {
                    ...m,
                    // material: currentMesh.material ? parsedMaterials.find(p => p.name === currentMesh.material.name)?.id : undefined,
                    indices: accessors[currentMesh.indices]?.data,
                    vertices: accessors[currentMesh.vertices]?.data,
                    tangents: tangents,
                    normals: normals,
                    uvs: accessors[currentMesh.uvs].data,
                    maxBoundingBox: max,
                    minBoundingBox: min,
                }
            })
        })
        return {nodes: files, materials: parsedMaterials}
    } catch (error) {
        return {}
    }
}

function computeBoundingBox(vertices) {
    if (vertices && vertices.length > 0) {
        const toVector = groupInto(3, vertices)
        let min = [], max = []
        for (let i = 0; i < toVector.length; i++) {
            const current = toVector[i]
            if (!min[0] || current[0] < min[0])
                min[0] = current[0]

            if (!min[1] || current[1] < min[1])
                min[1] = current[1]

            if (!min[2] || current[2] < min[2])
                min[2] = current[2]

            if (!max[0] || current[0] > max[0])
                max[0] = current[0]

            if (!max[1] || current[1] > max[1])
                max[1] = current[1]

            if (!max[2] || current[2] > max[2])
                max[2] = current[2]
        }

        return [min, max]

    } else
        return [0, 0]
}