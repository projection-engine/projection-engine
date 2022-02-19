import {vec2, vec3} from "gl-matrix";
import groupInto from "../engine/utils/groupInto";
import FileBlob from "../workers/FileBlob";
import { getPrimitives, materialParser, nodeParser} from "./utils/glTFUtils";
import PrimitiveProcessor from "./workers/PrimitiveProcessor";
import GLTFBuffer from "./workers/GLTFBuffer";
import Accessor from "./workers/Accessor";

const fs = window.require('fs')
export default class GLTF {
    static async parseGLTF(data, basePath) {

        return new Promise(rootResolve => {

            let parsed = JSON.parse(data)
            const buffers = parsed.buffers.map(b => {
                return new GLTFBuffer(b, basePath)
            })

            Promise.all(buffers.map(b => b.initialize()))
                .then(() => {
                parsed.buffers = null
                const accessors = parsed.accessors.map(a => {
                    return new Accessor(a, buffers, parsed.bufferViews)
                })
                const mainScene = parsed.scenes[0]
                let sceneNodes = parsed.nodes
                    .map((n, index) => {
                        if (mainScene.nodes.includes(index))
                            return {...parsed.nodes[index], index}
                        else
                            return undefined
                    }).filter(e => e !== undefined)


                sceneNodes = sceneNodes
                    .map(n => nodeParser(n, parsed.nodes)).flat()
                parsed = {
                    materials: parsed.materials,
                    meshes: parsed.meshes,
                    textures: parsed.textures,
                    images: parsed.images
                }
                const materials = parsed.materials ? parsed.materials.map(m => {
                    return materialParser(basePath, m, parsed.textures, parsed.images)
                }) : []

                Promise.all(materials)
                    .then(parsedMaterials => {

                        let meshes = parsed.meshes.filter((_, index) => {
                            return sceneNodes.find(n => n.meshIndex === index) !== undefined
                        }).map(m => {
                            return getPrimitives(m, parsed.materials)[0]
                        })
                        let files = []
                        sceneNodes.forEach(m => {
                            const [min, max] = GLTF.computeBoundingBox(accessors[meshes[m.meshIndex]?.vertices].data)
                            files.push(
                                {
                                    name: m.name,
                                    data: {
                                        ...m,
                                        material: meshes[m.meshIndex].material ? materials[meshes[m.meshIndex].material].id : undefined,
                                        indices: accessors[meshes[m.meshIndex].indices]?.data,
                                        vertices: accessors[meshes[m.meshIndex].vertices]?.data,
                                        tangents: accessors[meshes[m.meshIndex].tangents]?.data,
                                        normals: accessors[meshes[m.meshIndex].normals]?.data,
                                        uvs: accessors[meshes[m.meshIndex].uvs].data,

                                        maxBoundingBox: max,
                                        minBoundingBox: min,
                                    }
                                }
                            )
                        })

                        rootResolve({nodes: files, materials: parsedMaterials})
                    })
            }).catch((error) => {
                rootResolve({})
            })
        })
    }

    static computeBoundingBox(vertices) {
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
}