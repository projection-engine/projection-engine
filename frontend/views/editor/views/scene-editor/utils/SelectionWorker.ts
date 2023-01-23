export default class SelectionWorker {
    static #worker?: Worker
    static get worker(): Worker {
        if (SelectionWorker.#worker)
            return SelectionWorker.#worker

        const src = ` 
            self.onmessage = ({data: {entities, data}}) => {
                const map = {}
                for(let i= 0; i < entities.length; i++){
                    const {id, pick} = entities[i]
                    map[pick] = id
                }
                const selected = [], ids = []
                for (let i = 0; i < data.length; i += 4) {
                    const ID =  Math.round(data[i] + data[i + 1] + data[i + 2] )
                    const found = map[ID]
                    if(!found || selected.includes(ID)) 
                        continue
                    selected.push(ID)
                    ids.push(found)
                }
                self.postMessage(ids)
            }
        `

        SelectionWorker.#worker = new Worker(src);
        return SelectionWorker.#worker
    }


}