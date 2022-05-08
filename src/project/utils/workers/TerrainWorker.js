import ImageProcessor from "../../engine/utils/image/ImageProcessor";
// import PrimitiveProcessor from "./files/gltf/workers/PrimitiveProcessor";

export default class TerrainWorker {
    static loadHeightMap(imgBlob, settings) {
        const img = new Image(imgBlob)
        img.src = imgBlob

        return new Promise(resolve => {
            img.onload = () => {
                const ctx = ImageProcessor.getContext(img)

                const vertexCount = img.naturalHeight

                const count = vertexCount ** 2
                const terrainDimensions = settings.dimension ? settings.dimension : img.naturalHeight
                let vertices = new Array(count * 3),

                    uvs = new Array(count * 2),
                    indices = new Array(6 * (vertexCount - 1) * vertexCount),
                    vertexPointer = 0


                for (let i = 0; i < vertexCount; i++) {
                    for (let j = 0; j < vertexCount; j++) {
                        vertices[vertexPointer * 3] = (j / (vertexCount - 1)) * terrainDimensions
                        vertices[vertexPointer * 3 + 1] = TerrainWorker.sampleTexture(j, i, ctx, settings.heightScale)
                        vertices[vertexPointer * 3 + 2] = (i / (vertexCount - 1)) * terrainDimensions


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

                // const normals = PrimitiveProcessor.computeNormals(indices, vertices)
                // const tangents = PrimitiveProcessor.computeTangents(indices, vertices, uvs, normals)

                resolve({
                    vertices,
                    uvs,
                    normals,
                    indices,
                    tangents,
                    heightMap: imgBlob
                })
            }
        })

    }

    static sampleTexture(x, y, ctx, heightScale) {
        const [
            r
        ] = ImageProcessor.getPixel(ctx, x, y)
        let height = (r / 255)
        return height * heightScale
    }

}