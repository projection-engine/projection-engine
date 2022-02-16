import {vec2, vec3} from "gl-matrix";
import groupInto from "../engine/utils/groupInto";
import FileBlob from "./FileBlob";
import {getBufferData, getPrimitives, nodeParser, unpackBufferViewData} from "../utils/glTFUtils";
import PrimitiveProcessor from "./PrimitiveProcessor";


export default class MeshParser {
    static parseObj(data) {
        let txt = data.trim() + "\n";
        let line,
            itm,
            ary,
            i,
            ind,
            isQuad = false,
            aCache = [],
            cVert = [],
            cNorm = [],
            cUV = [],
            fVert = [],
            fNorm = [],
            fTangents = [],
            fUV = [],
            fIndex = [],
            fIndexCnt = 0,
            posA = 0,
            posB = txt.indexOf("\n", 0),
            groupedUVS = []

        while (posB > posA) {
            line = txt.substring(posA, posB).trim();
            switch (line.charAt(0)) {
                case "v":
                    itm = line.split(" ");
                    itm.shift();
                    switch (line.charAt(1)) {
                        case " ":
                            cVert.push(parseFloat(itm[0]), parseFloat(itm[1]), parseFloat(itm[2]));
                            break;		//VERTEX
                        case "t":
                            cUV.push(parseFloat(itm[0]), parseFloat(itm[1]));
                            break;							//UV
                        case "n":
                            cNorm.push(parseFloat(itm[0]), parseFloat(itm[1]), parseFloat(itm[2]));
                            break;	//NORMAL
                    }
                    break;
                case "f":
                    itm = line.split(" ");
                    itm.shift();
                    isQuad = false;
                    let allUVs = []
                    for (i = 0; i < itm.length; i++) {
                        const column = itm[i].split("/");
                        allUVs.push(parseInt(column[1]) - 1)

                        if (i === 3 && !isQuad) {
                            i = 2
                            isQuad = true;
                        }
                        if (itm[i] in aCache)
                            fIndex.push(aCache[itm[i]]);
                        else {
                            ary = itm[i].split("/");
                            ind = (parseInt(ary[0]) - 1) * 3;
                            let currentVertices = [cVert[ind], cVert[ind + 1], cVert[ind + 2]],
                                currentUVS = []
                            fVert.push(...currentVertices);
                            ind = (parseInt(ary[2]) - 1) * 3;
                            fNorm.push(cNorm[ind], cNorm[ind + 1], cNorm[ind + 2]);
                            if (ary[1] !== "") {
                                ind = (parseInt(ary[1]) - 1) * 2;
                                currentUVS = [
                                    cUV[ind],
                                    cUV[ind + 1]
                                ]

                                fUV.push(...currentUVS)
                            }
                            aCache[itm[i]] = fIndexCnt;
                            fIndex.push(fIndexCnt);
                            fIndexCnt++;
                        }
                        if (i === 3 && isQuad) fIndex.push(aCache[itm[0]]);
                    }
                    groupedUVS.push(allUVs)
                    break;
            }
            posA = posB + 1;
            posB = txt.indexOf("\n", posA);
        }


        const faces = groupInto(3, fIndex)
        const vertices = groupInto(3, fVert)
        const uvs = groupInto(2, fVert)

        PrimitiveProcessor.computeTangents(faces, vertices, uvs, groupedUVS)


        const [min, max] = MeshParser.computeBoundingBox(fVert)
        return {
            vertices: fVert,
            indices: fIndex,
            normals: fNorm,
            uvs: fUV,
            tangents: fTangents,
            maxBoundingBox: max,
            minBoundingBox: min
        }
    }

    static async parseGLTF(data, files = []) {

        return new Promise(rootResolve => {

            let parsed = JSON.parse(data)
            const bufferPromises = parsed.buffers.map(b => {
                if (b.uri.includes('base64'))
                    return new Promise(resolve => {
                        getBufferData(b.uri).then(res => resolve(res))
                    })
                else if (files && files.length > 0) {
                    const found = files.find(f => f.name === b.uri)
                    console.log(files, b.uri)
                    if (found)
                        return new Promise(resolve => {

                            FileBlob.loadAsString(found, true)
                                .then(r => {
                                    getBufferData(r, true)
                                        .then(res => resolve(res))
                                })
                        })
                    else
                        return new Promise((_, reject) => reject())
                }
            })

            Promise.all(bufferPromises).then(parsedBuffers => {
                parsed.buffers = null

                let accessorPromises = parsed.accessors.map(a => {
                    let items = 0
                    switch (a.type) {
                        case 'SCALAR':
                            items = 1
                            break
                        case 'VEC2':
                            items = 2
                            break
                        case 'VEC3':
                            items = 3
                            break
                        case 'VEC4':
                            items = 4
                            break
                        default:
                            break
                    }

                    let elementBytesLength = (a.componentType === 5123 ? Uint16Array : Float32Array).BYTES_PER_ELEMENT;
                    let typedGetter = a.componentType === 5123 ? 'getUint16' : 'getFloat32'
                    const length = items * a.count;

                    return new Promise(resolve => {
                        unpackBufferViewData(
                            parsedBuffers,
                            parsed.bufferViews,
                            length,
                            elementBytesLength,
                            typedGetter,
                            a.bufferView
                        ).then(res => resolve({
                            ...a,
                            data: res
                        }))

                    })

                })

                Promise.all(accessorPromises).then(parsedAccessors => {
                    const mainScene = parsed.scenes[0]
                    let sceneNodes = parsed.nodes
                        .map((n, index) => {
                            if (mainScene.nodes.includes(index))
                                return {...parsed.nodes[index], index}
                            else
                                return undefined
                        }).filter(e => e !== undefined)

                    sceneNodes = sceneNodes.map(n => nodeParser(n, parsed.nodes)).flat()
                    parsed = {materials: parsed.materials, meshes: parsed.meshes}

                    let meshes = parsed.meshes.filter((_, index) => {
                        return sceneNodes.find(n => n.meshIndex === index) !== undefined
                    }).map(m => {
                        return getPrimitives(m, parsedAccessors, parsed.materials)[0]
                    })
                    parsedAccessors = null

                    let files = []
                    sceneNodes.forEach(m => {
                        const [min, max] = MeshParser.computeBoundingBox(meshes[m.meshIndex]?.vertices)

                        files.push(
                            {
                                name: m.name,
                                data: {
                                    ...m,
                                    indices: meshes[m.meshIndex].indices,
                                    vertices: meshes[m.meshIndex].vertices,
                                    tangents: meshes[m.meshIndex].tangents,
                                    normals: meshes[m.meshIndex].normals,
                                    uvs: meshes[m.meshIndex].uvs,

                                    maxBoundingBox: max,
                                    minBoundingBox: min,
                                }
                            }
                        )
                    })

                    rootResolve(files)
                }).catch((error) => {
                    rootResolve(null)
                })
            }).catch((error) => {
                rootResolve(null)
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