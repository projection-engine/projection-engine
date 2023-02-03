import readTypedFile from "../../../utils/read-typed-file";
import * as path from "path";


function atob(str) {
    return Buffer.from(str, 'base64').toString('binary');
}

export default class DataBuffer {
    basePath
    data?: DataView
    strData?: { uri?: string }

    constructor(data: { uri?: string }, basePath: string) {
        this.strData = data
        this.basePath = basePath
    }

    async initialize() {
        if (this.strData.uri.includes("data:application/octet-stream"))
            this.data = this.#getBufferData(this.strData.uri)
        else {
            const data = <string>(await readTypedFile(path.resolve(this.basePath + path.sep + this.strData.uri), "base64"))
            this.data = this.#getBufferData(data)
        }
        this.strData = undefined
    }

    #getBufferData(str: string): DataView {
        let byteCharacters = atob(str.replace("data:application/octet-stream;base64,", ""))
        let dv = new DataView(new ArrayBuffer(byteCharacters.length))
        Array.from(byteCharacters).forEach((char: string, i) => {
            dv.setUint8(i, char.charCodeAt(0))
        })
        return dv
    }
}