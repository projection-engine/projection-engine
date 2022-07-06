self.onmessage = ({data: {entities, data}}) => {
    const selected = [], ids = [], entitiesArray = Array.from(entities.values())
    for (let i = 0; i < data.length; i += 4) {
        const ID =  Math.round((data[i + 1] + data[i + 2]) * 255)
        if(ID > 0 && !selected.includes(ID)) {
            const found = entitiesArray.find(e => e.pickID === ID)
            if (found) {
                selected.push(ID)
                ids.push(found.id)
            }
        }
    }

    self.postMessage(ids)
}