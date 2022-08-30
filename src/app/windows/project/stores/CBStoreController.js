import {get} from "svelte/store";
import {contentBrowserStore} from "./templates/content-browser-store";
import NodeFS, {getCall} from "../../../libs/NodeFS";
import FilesAPI from "../../../libs/files/FilesAPI"
import handleDropFolder from "../views/content-browser/utils/handle-drop-folder";
import ROUTES from "../../../../assets/ROUTES";
import ContentBrowserAPI from "../../../libs/files/ContentBrowserAPI";
import Localization from "../../../libs/Localization";

export default class CBStoreController {
    static data = get(contentBrowserStore)
    static initialized = false
    static toCut = []

    static get PREVIEW_PATH(){
        return FilesAPI.path + FilesAPI.sep + "previews"
    }
    static get ASSETS_PATH() {
        return FilesAPI.path + FilesAPI.sep + "assets"
    }

    static getStore(onChange) {
        if (!CBStoreController.initialized) {
            CBStoreController.initialized = true
            FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "bookmarks.meta", "json")
                .then(res => {
                    if (res)
                        CBStoreController.updateStore({...CBStoreController.data, bookmarks: res})
                })
            CBStoreController.refreshFiles().catch()
        }
        return contentBrowserStore.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static async refreshFiles() {
        try{
            const data = await getCall(ROUTES.REFRESH_CONTENT_BROWSER, {pathName: CBStoreController.ASSETS_PATH})
            const fileTypes = await ContentBrowserAPI.refresh()
            CBStoreController.updateStore({...CBStoreController.data, items: data, ...fileTypes})
        }
        catch (err){
            console.error(err)
        }

    }
    static async createFolder(currentDirectory){
        let path = currentDirectory.id + FilesAPI.sep + Localization.PROJECT.FILES.NEW_FOLDER
        const existing = await ContentBrowserAPI.foldersFromDirectory(CBStoreController.ASSETS_PATH + currentDirectory.id)
        if (existing.length > 0)
            path += " - " + existing.length

        const [e] = await NodeFS.mkdir(CBStoreController.ASSETS_PATH + path, {})
        if (!e)
            CBStoreController.refreshFiles().catch()
    }

    static updateStore(value = CBStoreController.data) {
        CBStoreController.data = value
        contentBrowserStore.set({...value})
    }

    static removeBlock(v) {
        const prev = CBStoreController.data.bookmarks

        const n = prev.filter(i => !v.includes(i.path))
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        CBStoreController.updateStore({...CBStoreController.data, bookmarks: n})
    }

    static addBookmark(id) {
        const prev = CBStoreController.data.bookmarks

        const n = [...prev, {
            name: id.split(FilesAPI.sep).pop(),
            path: id
        }]
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        CBStoreController.updateStore({...CBStoreController.data, bookmarks: n})
    }

    static removeBookmark(id) {
        const prev = CBStoreController.data.bookmarks

        const n = prev.filter(i => i.path !== id)
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        CBStoreController.updateStore({...CBStoreController.data, bookmarks: n})
    }

    static renameBookmark(id, newPath) {
        const prev = CBStoreController.data.bookmarks
        const p = prev.filter(i => i.path !== id)
        const n = [...p, {
            name: newPath.split(FilesAPI.sep).pop(),
            path: newPath
        }]
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        CBStoreController.updateStore({...CBStoreController.data, bookmarks: n})
    }
    static paste (target, setCurrentDirectory) {
        if(CBStoreController.toCut.length > 0){
            handleDropFolder(
                [...CBStoreController.toCut],
                target,
                {id: target},
                setCurrentDirectory
            )
            CBStoreController.toCut = []
        }
    }
}