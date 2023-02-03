import ElectronResources from "../ElectronResources"


export function getCall<T>(channel, data, addMiddle = true):Promise<T> {
    return new Promise(resolve => {
        let listenID = crypto.randomUUID()
        if (data.listenID)
            listenID = data.listenID
        ElectronResources.ipcRenderer.once(channel + (addMiddle ? "-" : "") + listenID, (ev, data:T) => {
            resolve(data)
        })

        ElectronResources.ipcRenderer.send(channel, {...data, listenID})
    })
}