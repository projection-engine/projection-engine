import ImageProcessor from "./ImageProcessor";
import PrimitiveProcessor from "../gltf/workers/PrimitiveProcessor";

const SIZE = 800, MAX_HEIGHT = 50
export default class TerrainWorker {
    static loadHeightMap(imgBlob) {
        const img = new Image(imgBlob)
        img.src = imgBlob

        return new Promise(resolve => {
            img.onload = () => {
                const ctx = ImageProcessor.getContext(img)

                const vertexCount = img.naturalHeight

                const count = vertexCount ** 2

                let vertices = new Array(count * 3),
                    normals = new Array(count * 3),
                    uvs = new Array(count * 2),
                    indices = new Array(6 * (vertexCount - 1) * vertexCount),
                    vertexPointer = 0


                for (let i = 0; i < vertexCount; i++) {
                    for (let j = 0; j < vertexCount; j++) {
                        vertices[vertexPointer * 3] = (j / (vertexCount - 1)) * vertexCount
                        vertices[vertexPointer * 3 + 1] = TerrainWorker.sampleTexture(j, i, ctx)
                        vertices[vertexPointer * 3 + 2] = (i / (vertexCount - 1)) *  vertexCount

                        normals[vertexPointer * 3] = 0
                        normals[vertexPointer * 3 + 1] = 1
                        normals[vertexPointer * 3 + 2] = 0

                        uvs[vertexPointer * 2] = j / (vertexCount - 1)
                        uvs[vertexPointer * 2 + 1] = i / (vertexCount - 1)
                        vertexPointer++
                    }
                }

                let pointer = 0
                for (let gz = 0; gz < vertexCount - 1; gz++) {
                    for (let gx = 0; gx < vertexCount - 1; gx++) {
                        const topLeft = (gz * vertexCount) + gx,
                            topRight = topLeft + 1,
                            bottomLeft = ((gz + 1) * vertexCount) + gx,
                            bottomRight = bottomLeft + 1


                        indices[pointer++] = topLeft
                        indices[pointer++] = bottomLeft
                        indices[pointer++] = topRight
                        indices[pointer++] = topRight
                        indices[pointer++] = bottomLeft
                        indices[pointer++] = bottomRight
                    }
                }

                let tangents = PrimitiveProcessor.computeTangents(indices, vertices, uvs)
                resolve({
                    vertices,
                    uvs,
                    normals,
                    indices,
                    tangents
                })
            }
        })

    }

    static sampleTexture(x, y, ctx) {
        const [
            r
        ] = ImageProcessor.getPixel(ctx, x, y)
        return (r / 255) * MAX_HEIGHT
    }

}