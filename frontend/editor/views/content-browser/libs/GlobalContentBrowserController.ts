import FS from "../../../../lib/FS/FS";

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
            path = FS.sep
        GlobalContentBrowserController.subscribed.forEach(e => e(path))
    }
}