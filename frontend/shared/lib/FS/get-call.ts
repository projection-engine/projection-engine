import Electron from "../Electron"


export function getCall<T>(channel, data, addMiddle = true):Promise<T> {
    return new Promise(resolve => {
        let listenID = crypto.randomUUID()
        if (data.listenID)
            listenID = data.listenID
        Electron.ipcRenderer.once(channel + (addMiddle ? "-" : "") + listenID, (ev, data:T) => {
            resolve(data)
        })

        Electron.ipcRenderer.send(channel, {...data, listenID})
    })
}