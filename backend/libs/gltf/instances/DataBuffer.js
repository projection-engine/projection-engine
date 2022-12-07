import readTypedFile from "../../../utils/read-typed-file";

const fs = require("fs")
const path = require("path")
const atob = require("atob")

export default class DataBuffer {
    constructor(data, basePath) {
        this.data = data
        this.basePath = basePath
    }

    async initialize() {
        if (this.data.uri.includes("data:application/octet-stream"))
            this.data = this.#getBufferData(this.data.uri)
        else {
            const data = await readTypedFile(path.resolve(this.basePath + path.sep + this.data.uri), "base64")

            this.data = this.#getBufferData(data)
        }
    }

    #getBufferData(str) {
        let byteCharacters = atob(str.replace("data:application/octet-stream;base64,", ""))
        let dv = new DataView(new ArrayBuffer(byteCharacters.length))
        Array.from(byteCharacters).forEach((char, i) => {
            dv.setUint8(i, char.charCodeAt(0))
        })
        return dv
    }
}