import {WebWorker} from "../../WebWorker";

const fs = window.require('fs')


export default function read(path, options) {
    return new Promise(resolve => {

        fs.readFile(
            path,
            options,
            (err, data) => {

                if (err)
                    resolve()
                else {
                    const worker = new WebWorker()
                    worker.createExecution({s: data.toString()}, lzwDecode.toString())
                        .then(res => resolve(res))
                }
            })
    })
}

function lzwDecode() {
    self.addEventListener('message', async (event) => {
        const {s} = event.data
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i = 1; i < data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            } else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        self.postMessage(out.join(""))
    })
}