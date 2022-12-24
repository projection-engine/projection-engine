import PROJECT_FOLDER_STRUCTURE from "../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import PROJECT_STATIC_DATA from "../../../static/objects/PROJECT_STATIC_DATA";

import {getCall} from "./get-call";
import MutableObject from "../../../engine-core/MutableObject";


const pathRequire = window.require("path")
const fs = window.require("fs")
export default class NodeFS  {
    static sep:string = <string>pathRequire.sep
    static path?:string
    static temp?:string
    static PREVIEW_PATH?:string
    static ASSETS_PATH?:string
    static #initialized = false
    static initialize() {
        if (NodeFS.#initialized)
            return
        NodeFS.#initialized = true
        NodeFS.path = pathRequire.resolve(sessionStorage.getItem(PROJECT_STATIC_DATA.PROJECT_PATH).replace(PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION, "") + NodeFS.sep)
        NodeFS.temp = pathRequire.resolve(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.TEMP + NodeFS.sep)
        NodeFS.PREVIEW_PATH = pathRequire.resolve(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep)
        NodeFS.ASSETS_PATH = pathRequire.resolve(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.ASSETS + NodeFS.sep)
    }

    static resolvePath(path:string):string {
        return pathRequire.resolve(path)
    }

    static async read(path:string, options?: MutableObject | string) {
        return getCall("fs-read", {path, options})
    }

    static async write(path:string, data:any) {
        return getCall("fs-write", {path, data})
    }

    static async rm(path:string, options?: MutableObject | string) {
        return getCall("fs-rm", {path, options})
    }

    static async mkdir(path:string) {
        return getCall("fs-mkdir", {path})
    }

    static async stat(path:string, options?: MutableObject | string){
        return getCall("fs-stat", {path, options})
    }

    static exists(path:string): boolean {
        return fs.existsSync(pathRequire.resolve(path))
    }

    static async readdir(path:string, options?: MutableObject | string): Promise<MutableObject[]> {
        return getCall<MutableObject[]>("fs-readdir", {path, options})
    }

    static async rename(oldPath:string, newPath:string) {
        return getCall("fs-rename", {oldPath, newPath})
    }

}