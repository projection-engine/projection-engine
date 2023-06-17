import {getCall} from "../util/get-call"
import ElectronResources from "./ElectronResources"
import FileTypes from "../../../shared/FileTypes";
import Folders from "../../../shared/Folders";
import IPCRoutes from "../../../shared/IPCRoutes";


export default class FileSystemUtil {
	static sep:string = <string>ElectronResources.path.sep
	static path?:string
	static TEMP?:string
	static PREVIEW_PATH?:string
	static rootDir = ElectronResources.os.homedir()
	static ASSETS_PATH?:string
	static #initialized = false
	static initialize(path:string) {
		if (FileSystemUtil.#initialized)
			return
		FileSystemUtil.#initialized = true
		FileSystemUtil.path = ElectronResources.path.resolve(path.replace(FileTypes.PROJECT, "") + FileSystemUtil.sep)
		FileSystemUtil.TEMP = ElectronResources.path.resolve(FileSystemUtil.path + FileSystemUtil.sep + Folders.TEMP + FileSystemUtil.sep)
		FileSystemUtil.PREVIEW_PATH = ElectronResources.path.resolve(FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS + FileSystemUtil.sep)
		FileSystemUtil.ASSETS_PATH = ElectronResources.path.resolve(FileSystemUtil.path + FileSystemUtil.sep + Folders.ASSETS + FileSystemUtil.sep)
		if(!FileSystemUtil.exists(FileSystemUtil.ASSETS_PATH))
			FileSystemUtil.mkdir(FileSystemUtil.ASSETS_PATH).catch()
		if(!FileSystemUtil.exists(FileSystemUtil.PREVIEW_PATH))
			FileSystemUtil.mkdir(FileSystemUtil.PREVIEW_PATH).catch()
		if(!FileSystemUtil.exists(FileSystemUtil.TEMP))
			FileSystemUtil.mkdir(FileSystemUtil.TEMP).catch()

	}

	static resolvePath(path:string):string {
		if(!path)
			return path
		return ElectronResources.path.resolve(path)
	}

	static async read(path:string, options?: MutableObject | string):Promise<any> {
		return getCall(IPCRoutes.FS_READ, {path, options}, false)
	}

	static async write(path:string, data:any) {
		return getCall(IPCRoutes.FS_WRITE, {path, data}, false)
	}

	static async rm(path:string, options?: MutableObject | string) {
		return getCall(IPCRoutes.FS_RM, {path, options}, false)
	}

	static async mkdir(path:string) {
		return getCall(IPCRoutes.FS_MKDIR, {path}, false)
	}

	static async stat(path:string, options?: MutableObject | string):Promise<MutableObject>{
		return getCall(IPCRoutes.FS_STAT, {path, options}, false)
	}

	static exists(path:string): boolean {
		return ElectronResources.fs.existsSync(ElectronResources.path.resolve(path))
	}

	static async readdir(path:string, options?: MutableObject | string): Promise<MutableObject[]> {
		return getCall<MutableObject[]>(IPCRoutes.FS_READDIR, {path, options}, false)
	}

	static async rename(oldPath:string, newPath:string) {
		return getCall(IPCRoutes.FS_RENAME, {oldPath, newPath}, false)
	}

}