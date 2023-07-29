import FileSystemUtil from "../../../../shared/FileSystemUtil"

export default class GlobalContentBrowserController{
	static subscribed = new Map()

	static subscribe(id:string, callback:GenericVoidFunctionWithP<string>){
		GlobalContentBrowserController.subscribed.set(id, callback)
	}
	static unsubscribe(id:string){
		GlobalContentBrowserController.subscribed.delete(id)
	}

	static pushCurrentDirectory(dir:string){
		let path = dir
		if(!path)
			path = FileSystemUtil.sep
		GlobalContentBrowserController.subscribed.forEach(e => e(path))
	}
}
