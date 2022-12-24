import {v4} from "uuid";

const {ipcRenderer} = window.require("electron")
export function getCall<T>(channel, data, addMiddle = true):Promise<T> {
    return new Promise(resolve => {
        let listenID = v4().toString()
        if (data.listenID)
            listenID = data.listenID
        ipcRenderer.once(channel + (addMiddle ? "-" : "") + listenID, (ev, data:T) => {
            resolve(data)
        })

        ipcRenderer.send(channel, {...data, listenID})
    })
}