import FilesAPI from "../../../../shared/libs/files/FilesAPI";

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
            path = FilesAPI.sep
        GlobalContentBrowserController.subscribed.forEach(e => e(path))
    }
}