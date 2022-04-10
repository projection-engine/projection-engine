import {WebWorker} from "../../WebWorker";

const fs = window.require('fs')

export default  function write(path, data) {
    return new Promise(async resolve => {
        const worker = new WebWorker()
        worker.createExecution({s: data}, lzwEncode.toString())
            .then(res => {
                console.log(res)
                fs.writeFile(
                    path,
                    res,
                    () => {
                        resolve()
                    })
            })
    })
}

function lzwEncode() {
    self.addEventListener('message', async (event) => {
        const {s} = event.data
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            } else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        console.log(out.join(""))
        self.postMessage(out.join(""))
    })

}