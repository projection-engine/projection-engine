import FileSystemUtil from "../../../../shared/lib/FileSystemUtil"

export default class GlobalContentBrowserController{
	static subscribed = new Map()

	static subscribe(id, callback){
		GlobalContentBrowserController.subscribed.set(id, callback)
	}
	static unsubscribe(id){
		GlobalContentBrowserController.subscribed.delete(id)
	}

	static pushCurrentDirectory(dir){
		let path = dir
		if(!path)
			path = FileSystemUtil.sep
		GlobalContentBrowserController.subscribed.forEach(e => e(path))
	}
}