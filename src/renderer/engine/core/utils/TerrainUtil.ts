import getImageData from "@engine-core/utils/get-image-data";
import PrimitiveProcessor from "@engine-core/lib/math/PrimitiveProcessor";

export default class TerrainUtil {
    static #sampleTexture(x: number, y: number, buffer: Uint8ClampedArray, canvasSize: number) {
        const r = buffer[y * (canvasSize * 4) + x * 4]
        return (r / 255)
    }

    static #computeIndices(vertexCount: number): Float32Array {
        let pointer = 0
        const indices = new Float32Array(6 * (vertexCount - 1) * vertexCount)
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
        return indices
    }

    static #computeVertices(vertexCount: number, dimension: number, OFFSET: number, imageData: Uint8ClampedArray, canvas: OffscreenCanvas,): {
        uvs: Float32Array,
        vertices: Float32Array
    } {
        const count = vertexCount ** 2
        let vertexPointer = 0
        const vertices = new Float32Array(count * 3)
        const uvs = new Float32Array(count * 2)
        for (let i = 0; i < vertexCount; i++) {
            for (let j = 0; j < vertexCount; j++) {
                vertices[vertexPointer * 3] = (j / (vertexCount - 1)) * dimension - OFFSET
                vertices[vertexPointer * 3 + 1] = TerrainUtil.#sampleTexture(j, i, imageData, canvas.width)
                vertices[vertexPointer * 3 + 2] = (i / (vertexCount - 1)) * dimension - OFFSET

                uvs[vertexPointer * 2] = j / (vertexCount - 1)
                uvs[vertexPointer * 2 + 1] = i / (vertexCount - 1)
                vertexPointer++
            }
        }
        return {vertices, uvs}
    }

    static async buildTerrain(base64: string, dimension: number): Promise<[TerrainProcessorResult, Transferable[]]> {
        const {imageToLoad, imageData, canvas} = await getImageData(base64)
        const vertexCount = imageToLoad.width

        const OFFSET = dimension / 2
        const {uvs, vertices} = TerrainUtil.#computeVertices(vertexCount, dimension, OFFSET, imageData, canvas);
        const indices = TerrainUtil.#computeIndices(vertexCount);
        const normals = Float32Array.from(PrimitiveProcessor.computeNormals(indices, vertices))
        const tangents = Float32Array.from(PrimitiveProcessor.computeTangents(indices, vertices, uvs, normals))

        return [
            {vertices, uvs, normals, indices, tangents},
            [vertices.buffer, uvs.buffer, indices.buffer, normals.buffer, tangents.buffer]
        ]
    }
}
