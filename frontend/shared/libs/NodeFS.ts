import {v4} from "uuid"
import PROJECT_PATH from "../../../shared-resources/PROJECT_PATH";
import PROJECT_FOLDER_STRUCTURE from "../../../shared-resources/PROJECT_FOLDER_STRUCTURE";
import PROJECT_STATIC_DATA from "../../../shared-resources/PROJECT_STATIC_DATA";

const {ipcRenderer} = window.require("electron")
const pathRequire = window.require("path")

export function getCall(channel, data, addMiddle = true) {
    return new Promise(resolve => {
        let listenID = v4().toString()
        if (data.listenID)
            listenID = data.listenID
        ipcRenderer.once(channel + (addMiddle ? "-" : "") + listenID, (ev, data) => {
            resolve(data)
        })

        ipcRenderer.send(channel, {...data, listenID})
    })
}

function createTunnel(channel, data, callback, once) {
    if (once)
        ipcRenderer.once(channel, (ev, data) => {
            if (callback) callback(ev, data)
        })
    else
        ipcRenderer.on(channel, (ev, data) => {
            if (callback) callback(ev, data)
        })
    ipcRenderer.send(channel, data)
}


export default class NodeFS {
    static sep = pathRequire.sep
    static path
    static temp
    static PREVIEW_PATH
    static ASSETS_PATH

    static initializePaths() {
        NodeFS.path = pathRequire.resolve(sessionStorage.getItem(PROJECT_PATH).replace(PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION, "") + NodeFS.sep)
        NodeFS.temp = pathRequire.resolve(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.TEMP + NodeFS.sep)
        NodeFS.PREVIEW_PATH = pathRequire.resolve(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep)
        NodeFS.ASSETS_PATH = pathRequire.resolve(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.ASSETS + NodeFS.sep)
    }

    static resolvePath(path) {
        return pathRequire.resolve(path)
    }

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

    static async rename(oldPath, newPath) {
        return (await getCall("fs-rename", {oldPath, newPath}))
    }

}