import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import PROJECT_STATIC_DATA from "../../../../static/objects/PROJECT_STATIC_DATA";
import {getCall} from "./get-call";
import ElectronResources from "../ElectronResources";


export default class FS {
    static sep:string = <string>ElectronResources.path.sep
    static path?:string
    static TEMP?:string
    static PREVIEW_PATH?:string
    static rootDir = ElectronResources.os.homedir()
    static ASSETS_PATH?:string
    static #initialized = false
    static initialize(path:string) {
        if (FS.#initialized)
            return
        FS.#initialized = true
        FS.path = ElectronResources.path.resolve(path.replace(PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION, "") + FS.sep)
        FS.TEMP = ElectronResources.path.resolve(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.TEMP + FS.sep)
        FS.PREVIEW_PATH = ElectronResources.path.resolve(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + FS.sep)
        FS.ASSETS_PATH = ElectronResources.path.resolve(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.ASSETS + FS.sep)
        if(!FS.exists(FS.ASSETS_PATH))
            FS.mkdir(FS.ASSETS_PATH).catch()
        if(!FS.exists(FS.PREVIEW_PATH))
            FS.mkdir(FS.PREVIEW_PATH).catch()
        if(!FS.exists(FS.TEMP))
            FS.mkdir(FS.TEMP).catch()

    }

    static resolvePath(path:string):string {
        if(!path)
            return path
        return ElectronResources.path.resolve(path)
    }

    static async read(path:string, options?: MutableObject | string):Promise<any> {
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

    static async stat(path:string, options?: MutableObject | string):Promise<MutableObject>{
        return getCall("fs-stat", {path, options})
    }

    static exists(path:string): boolean {
        return ElectronResources.fs.existsSync(ElectronResources.path.resolve(path))
    }

    static async readdir(path:string, options?: MutableObject | string): Promise<MutableObject[]> {
        return getCall<MutableObject[]>("fs-readdir", {path, options})
    }

    static async rename(oldPath:string, newPath:string) {
        return getCall("fs-rename", {oldPath, newPath})
    }

}