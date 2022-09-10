import {v4} from "uuid"

const {ipcRenderer} = window.require("electron")

export function getCall(channel, data, addMiddle=true) {
    return new Promise(resolve => {
        const listenID = v4().toString()
        ipcRenderer.once(channel + (addMiddle ? "-" : "") + listenID, (ev, data) => {
            resolve(data)
        })
        ipcRenderer.send(channel, {...data, listenID})
    })
}

export default class NodeFS {

    static async read(path, options = {}) {
        return (await getCall("fs-read", {path, options}))
    }

    static async write(path, data) {
        return (await getCall("fs-write", {path, data}))
    }

    static async rm(path, options = {}) {
        return (await getCall("fs-rm", {path, options}))
    }

    static async mkdir(path) {
        return (await getCall("fs-mkdir", {path}))
    }

    static async stat(path, options = {}) {
        return (await getCall("fs-stat", {path, options}))
    }

    static async exists(path) {
        return (await getCall("fs-exists", {path}))
    }

    static async readdir(path, options) {
        return (await getCall("fs-readdir", {path, options}))
    }

    static async lstat(path, options) {
        return (await getCall("fs-lstat", {path, options}))
    }

    static async rename(oldPath, newPath) {
        return (await getCall("fs-rename", {oldPath, newPath}))
    }
}