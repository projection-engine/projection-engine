import {getCall} from "../util/get-call"
import ElectronResources from "./ElectronResources"
import FileTypes from "../../../shared/FileTypes";
import Folders from "../../../shared/Folders";
import IPCRoutes from "../../../shared/IPCRoutes";
import AbstractSingleton from "../../../shared/AbstractSingleton";


export default class FileSystemService extends AbstractSingleton{
	sep:string = <string>ElectronResources.path.sep
	path?:string
	TEMP?:string
	PREVIEW_PATH?:string
	rootDir = ElectronResources.os.homedir()
	ASSETS_PATH?:string

	constructor(path) {
		super();
		this.path = ElectronResources.path.resolve(path.replace(FileTypes.PROJECT, "") + this.sep)
		this.TEMP = ElectronResources.path.resolve(this.path + this.sep + Folders.TEMP + this.sep)
		this.PREVIEW_PATH = ElectronResources.path.resolve(this.path + this.sep + Folders.PREVIEWS + this.sep)
		this.ASSETS_PATH = ElectronResources.path.resolve(this.path + this.sep + Folders.ASSETS + this.sep)
		if(!this.exists(this.ASSETS_PATH))
			this.mkdir(this.ASSETS_PATH).catch()
		if(!this.exists(this.PREVIEW_PATH))
			this.mkdir(this.PREVIEW_PATH).catch()
		if(!this.exists(this.TEMP))
			this.mkdir(this.TEMP).catch()

	}

	static getInstance(): FileSystemService{
		return super.get<FileSystemService>()
	}

	resolvePath(path:string):string {
		if(!path)
			return path
		return ElectronResources.path.resolve(path)
	}

	async read(path:string, options?: MutableObject | string):Promise<any> {
		return getCall(IPCRoutes.FS_READ, {path, options}, false)
	}

	async write(path:string, data:any) {
		return getCall(IPCRoutes.FS_WRITE, {path, data}, false)
	}

	async rm(path:string, options?: MutableObject | string) {
		return getCall(IPCRoutes.FS_RM, {path, options}, false)
	}

	async mkdir(path:string) {
		return getCall(IPCRoutes.FS_MKDIR, {path}, false)
	}

	async stat(path:string, options?: MutableObject | string):Promise<MutableObject>{
		return getCall(IPCRoutes.FS_STAT, {path, options}, false)
	}

	exists(path:string): boolean {
		return ElectronResources.fs.existsSync(ElectronResources.path.resolve(path))
	}

	async readdir(path:string, options?: MutableObject | string): Promise<MutableObject[]> {
		return getCall<MutableObject[]>(IPCRoutes.FS_READDIR, {path, options}, false)
	}

	async rename(oldPath:string, newPath:string) {
		return getCall(IPCRoutes.FS_RENAME, {oldPath, newPath}, false)
	}

}