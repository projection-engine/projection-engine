export default class SelectionWorker {
	static #worker?: Worker
	static worker(): Worker {
		if (SelectionWorker.#worker)
			return SelectionWorker.#worker

		const src = ` 
            self.onmessage = ({data: {entities, data}}) => {
                const map = {}
                for(let i= 0; i < entities.length; i++){
                    const {id, pick} = entities[i]
                    map[Math.round(pick).toString()] = id
                }
                const selected = [], ids = []
                for (let i = 0; i < data.length; i += 4) {
                    const ID =  Math.round(data[i] + data[i + 1] + data[i + 1])
                    const found = map[ID.toString()]
                    if(!found || selected.includes(ID)) 
                        continue
                    selected.push(ID)
                    ids.push(found)
                }
                self.postMessage(ids)
            }
        `
		const workerBlob = new Blob([src], {type: "application/javascript"})
		const workerUrl = URL.createObjectURL(workerBlob)
		SelectionWorker.#worker = new Worker(workerUrl)
		return SelectionWorker.#worker
	}


}