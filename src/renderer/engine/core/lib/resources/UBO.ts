import GPUState from "../../states/GPUState"

export default class UBO implements IResource{
    items: UBOItem[] = []
    keys: string[] = []
    buffer?: WebGLBuffer
    blockName?: string
    blockPoint?: number

    static #blockPointIncrement = 0
    static #getGlslSizes(type) {
        switch (type) {
            case "float": case "int": case "bool": return [4,4]
            case "mat4": return [64,64]
            case "mat3": return [48,48]
            case "vec2": return [8,8]
            case "vec3": return [16,12]
            case "vec4": return [16,16]
            default: return [0,0]
        }
    }

    constructor(blockName: string, dataArray: UBOData[]) {

        const bufferSize = UBO.#calculate(dataArray)
        for (let i = 0; i < dataArray.length; i++) {
            this.items[dataArray[i].name] = {
                offset: dataArray[i].offset,
                dataSize: dataArray[i].dataSize,
                chunkSize: dataArray[i].chunkSize
            }
            this.keys[i] = dataArray[i].name
        }

        this.blockName = blockName
        this.blockPoint = UBO.#blockPointIncrement
        UBO.#blockPointIncrement += 1

        this.buffer = GPUState.context.createBuffer()
        GPUState.context.bindBuffer(GPUState.context.UNIFORM_BUFFER, this.buffer)
        GPUState.context.bufferData(GPUState.context.UNIFORM_BUFFER, bufferSize, GPUState.context.DYNAMIC_DRAW)
        GPUState.context.bindBuffer(GPUState.context.UNIFORM_BUFFER, null)
        GPUState.context.bindBufferBase(GPUState.context.UNIFORM_BUFFER, this.blockPoint, this.buffer)
    }

    bindWithShader(shaderProgram: WebGLProgram) {
        GPUState.context.useProgram(shaderProgram)
        const index = GPUState.context.getUniformBlockIndex(shaderProgram, this.blockName)
        GPUState.context.uniformBlockBinding(shaderProgram, index, this.blockPoint)
        GPUState.context.bindBuffer(GPUState.context.UNIFORM_BUFFER, null)
    }

    bind() {
        GPUState.context.bindBuffer(GPUState.context.UNIFORM_BUFFER, this.buffer)
    }

    unbind() {
        GPUState.context.bindBuffer(GPUState.context.UNIFORM_BUFFER, null)
    }

    updateData(name, data) {
        GPUState.context.bufferSubData(GPUState.context.UNIFORM_BUFFER, this.items[name].offset, data, 0, null)
    }

    updateBuffer(data) {
        GPUState.context.bufferSubData(GPUState.context.UNIFORM_BUFFER, 0, data, 0, null)
    }

    static #calculate(dataArray: UBOData[]): number {
        let chunk = 16,
            tsize = 0,
            offset = 0,
            size

        for (let i = 0; i < dataArray.length; i++) {
            if (!dataArray[i].dataLength || dataArray[i].dataLength === 0)
                size = UBO.#getGlslSizes(dataArray[i].type)
            else
                size = [dataArray[i].dataLength * 16 * 4, dataArray[i].dataLength * 16 * 4]

            tsize = chunk - size[0]

            if (tsize < 0 && chunk < 16) {
                offset += chunk
                if (i > 0) dataArray[i - 1].chunkSize += chunk
                chunk = 16
            } else if (tsize === 0) {
                if (dataArray[i].type === "vec3" && chunk === 16) chunk -= size[1]
                else chunk = 16
            } else if (tsize >= 0 || chunk !== 16) chunk -= size[1]


            dataArray[i].offset = offset
            dataArray[i].chunkSize = size[1]
            dataArray[i].dataSize = size[1]

            offset += size[1]
        }


        return offset
    }

}
