const fs = require('fs')
const path = require('path')
const atob = require('atob')
export default class Buffer {
    constructor(data, basePath) {
        this.data = data
        this.basePath = basePath
    }

    initialize(){
        if (this.data.uri.includes('base64'))
            return new Promise(resolve => {
                this.data = this._getBufferData(this.data.uri)
                resolve()
            })
        else {
            return new Promise(resolve => {
                fs.readFile(path.resolve(this.basePath + '\\' + this.data.uri), 'base64', (e, r) => {
                    this.data = this._getBufferData(r)
                    resolve()
                })
            })
        }
    }
    _getBufferData(str) {
        let byteCharacters = atob(str.replace('data:application/octet-stream;base64,', ''));

        let dv = new DataView(new ArrayBuffer(byteCharacters.length));

        Array.from(byteCharacters).forEach((char, i) => {
            dv.setUint8(i, char.charCodeAt(0));
        });

        return dv;
    }
}