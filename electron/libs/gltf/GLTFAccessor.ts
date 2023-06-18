
export default class GLTFAccessor {
	_data
	constructor(data, buffers, bufferViews) {
		let items = 0
		switch (data.type) {
		case "SCALAR":
			items = 1
			break
		case "VEC2":
			items = 2
			break
		case "VEC3":
			items = 3
			break
		case "VEC4":
			items = 4
			break
		default:
			break
		}

		let elementBytesLength, typedGetter

		switch (data.componentType) {
		case 5120: // SIGNED BYTE 8
			elementBytesLength = Int8Array
			typedGetter = "getInt8"
			break
		case 5121: // UNSIGNED BYTE 8
			elementBytesLength = Uint8Array
			typedGetter = "getUint8"
			break
		case 5122: // SIGNED SHORT 16
			elementBytesLength = Int16Array
			typedGetter = "getInt16"
			break
		case 5123: // UNSIGNED SHORT 16
			elementBytesLength = Uint16Array
			typedGetter = "getUint16"
			break
		case 5125: // UNSIGNED INT 32
			elementBytesLength = Uint32Array
			typedGetter = "getUint32"
			break
		default: // FLOAT
			elementBytesLength = Float32Array
			typedGetter = "getFloat32"
			break
		}
		elementBytesLength = elementBytesLength.BYTES_PER_ELEMENT

		const length = items * data.count
		const res = this.#unpackBufferViewData(
			buffers,
			bufferViews,
			length,
			elementBytesLength,
			typedGetter,
			data.bufferView
		)

		this._data =  {
			...data,
			data: res
		}
	}
	get data(){
		return this._data.data
	}
	#unpackBufferViewData(
		buffers,
		bufferViews,
		length,
		elementBytesLength,
		typedGetter,
		bufferView
	) {

		const bufferId = bufferViews[bufferView].buffer
		let offset = bufferViews[bufferView].byteOffset
		if (!offset)
			offset = 0

		const dv = buffers[bufferId].data

		return Array.from({
			length
		}).map((el, i) => {
			const loopOffset = offset + Math.max(0, elementBytesLength * i)
			return dv[typedGetter](loopOffset, true)
		})
	}
}