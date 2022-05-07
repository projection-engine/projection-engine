import groupInto from "./utils/groupInto";
import {getPrimitives, nodeParser} from "./utils/glTFUtils";
import GLTFBuffer from "./workers/GLTFBuffer";
import Accessor from "./workers/Accessor";
import PrimitiveProcessor from "./workers/PrimitiveProcessor";

export default class GLTF {
    static async parseGLTF(data, basePath, options) {
        try {
            let parsed = JSON.parse(data)
            const buffers = parsed.buffers.map(b => {
                return new GLTFBuffer(b, basePath)
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
                .map(n => nodeParser(n, parsed.nodes))
                .flat()

            parsed = {
                materials: parsed.materials,
                meshes: parsed.meshes,
                textures: parsed.textures,
                images: parsed.images
            }
            // const parsedMaterials = await Promise.all(parsed.materials ? parsed.materials.map(m => {
            //     return materialParser(basePath, m, parsed.textures, parsed.images)
            // }) : [])

            console.log(parsed)
            let meshes = parsed.meshes.filter((_, index) => {
                return sceneNodes.find(n => n.meshIndex === index) !== undefined
            }).map(m => getPrimitives(m, parsed.materials)[0])
            console.log(parsed, meshes)
            let files = []
            sceneNodes.forEach(m => {
                const [min, max] = GLTF.computeBoundingBox(accessors[meshes[m.meshIndex]?.vertices].data)
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
            console.log(files)
            return {nodes: files, materials: []}
        } catch (error) {
            console.trace(error)
            return {}
        }
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