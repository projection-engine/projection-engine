export default function selectionQueryWorker() {
    if (window.selectionWorker != null)
        return
    const src = ` 
    self.onmessage = ({data: {entities, data}}) => {
        const map = {}
        for(let i= 0; i < entities.length; i++){
            const {id, pick} = entities[i]
            map[pick[0] * 255 + pick[1] * 255 + pick[2] * 255] = id
        }
        const selected = [], ids = []
        for (let i = 0; i < data.length; i += 4) {
            const ID =  Math.round((data[i + 1] + data[i + 2]) * 255)
            const found = map[ID]
            if(!found || selected.includes(ID)) 
                continue
            selected.push(ID)
            ids.push(found)
        }
        self.postMessage(ids)
    }
    `
    const workerBlob = new Blob([src], {type: "application/javascript"});
    const workerUrl = URL.createObjectURL(workerBlob);
    window.selectionWorker = new Worker(workerUrl);

}