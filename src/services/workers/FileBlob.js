import {WebWorker} from "./WebWorker";

export default class FileBlob {
    static loadAsString(file, binary, dataURL) {
        const worker = new WebWorker()
        return worker.createExecution({file, binary: binary, dataURL}, () => {
            self.addEventListener('message', e => {
                let reader = new FileReader();
                reader.addEventListener('load', event => {
                    self.postMessage(event.target.result)
                });
                if (e.data.binary && !e.data.dataURL)
                    reader.readAsBinaryString(e.data.file)
                else if (!e.data.binary && !e.data.dataURL)
                    reader.readAsText(e.data.file)
                else if (!e.data.binary && e.data.dataURL){
                    reader.readAsDataURL(e.data.file)
                }
            })
        })
    }

    static loadAsJSON(file) {
        const worker = new WebWorker()
        return worker.createExecution(file, () => {
            self.addEventListener('message', event => {
                let reader = new FileReader();
                reader.addEventListener('load', event => {
                    self.postMessage(JSON.parse(event.target.result))
                });
                reader.readAsText(event.data)
            })
        })
    }
}