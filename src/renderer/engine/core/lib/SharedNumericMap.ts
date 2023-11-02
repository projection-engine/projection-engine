import ArrayBufferUtil from "@engine-core/utils/ArrayBufferUtil";

export default class SharedNumericMap extends Map<string, { startIndex: number, endIndex: number }> {
    #data: Float32Array

    constructor(size: number, initialData?: {
        array: Float32Array,
        keys: { name: string, startIndex: number, endIndex: number }[]
    }) {
        super();
        if (initialData != null) {
            this.#data = initialData.array
            initialData.keys.forEach(k => {
                this.set(k.name, k)
            })
        } else {
            this.#data = ArrayBufferUtil.allocateVector(size) as Float32Array
        }
    }

    getKeyValues(k: string, target?: Float32Array): Float32Array | null {
        if (!super.has(k))
            return null
        const {startIndex, endIndex} = super.get(k)
        let index = 0
        if (target == null)
            target = new Float32Array(endIndex - startIndex)
        for (let i = startIndex; i < endIndex; i++) {
            target[index] = this.#data[i]
            index++
        }
        return target
    }

    getIndexedValue(k: string): number {
        if (!super.has(k))
            return null
        const {startIndex} = super.get(k)
        return this.#data[startIndex]
    }

    setKeyValue(k: string, values: number[]) {
        if (!super.has(k))
            return null
        const {startIndex, endIndex} = super.get(k)
        let index = 0
        for (let i = startIndex; i < endIndex; i++) {
            this.#data[i] = values[index]
            index++
        }
    }

    getArray(): Float32Array {
        return this.#data
    }
}
