import NodeFS from "frontend/shared/libs/NodeFS";

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
            path = NodeFS.sep
        GlobalContentBrowserController.subscribed.forEach(e => e(path))
    }
}