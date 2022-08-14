import {get} from "svelte/store";
import {fileStore} from "./file-store";
import {getCall} from "../../../data/NodeFS";
import FilesAPI from "../../../data/files/FilesAPI"
import handleDropFolder from "../views/content-browser/utils/handle-drop-folder";
import ROUTES from "../../../../assets/ROUTES";
import ContentBrowser from "../views/content-browser/ContentBrowser.svelte";
import ContentBrowserAPI from "../../../data/files/ContentBrowserAPI";

export default class FileStoreController {
    static data = get(fileStore)
    static initialized = false
    static toCut = []

    static get ASSETS_PATH() {
        return FilesAPI.path + FilesAPI.sep + "assets"
    }

    static getStore(onChange) {
        if (!FileStoreController.initialized) {
            FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "bookmarks.meta", "json")
                .then(res => {
                    if (res)
                        FileStoreController.updateStore({...FileStoreController.data, bookmarks: res})
                })
            FileStoreController.refreshFiles().catch()
        }
        return fileStore.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static async refreshFiles() {
        try{
            const data = await getCall(ROUTES.REFRESH_CONTENT_BROWSER, {pathName: FileStoreController.ASSETS_PATH})
            const fileTypes = await ContentBrowserAPI.refresh()
            FileStoreController.updateStore({...FileStoreController.data, items: data, ...fileTypes})
        }
        catch (err){
            console.error(err)
        }

    }

    static updateStore(value = FileStoreController.data) {
        FileStoreController.data = value
        fileStore.set({...value})
    }

    static removeBlock(v) {
        const prev = FileStoreController.data.bookmarks

        const n = prev.filter(i => !v.includes(i.path))
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FileStoreController.updateStore({...FileStoreController.data, bookmarks: n})
    }

    static addBookmark(id) {
        const prev = FileStoreController.data.bookmarks

        const n = [...prev, {
            name: id.split(FilesAPI.sep).pop(),
            path: id
        }]
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FileStoreController.updateStore({...FileStoreController.data, bookmarks: n})
    }

    static removeBookmark(id) {
        const prev = FileStoreController.data.bookmarks

        const n = prev.filter(i => i.path !== id)
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FileStoreController.updateStore({...FileStoreController.data, bookmarks: n})
    }

    static renameBookmark(id, newPath) {
        const prev = FileStoreController.data.bookmarks
        const p = prev.filter(i => i.path !== id)
        const n = [...p, {
            name: newPath.split(FilesAPI.sep).pop(),
            path: newPath
        }]
        FilesAPI.writeFile(FilesAPI.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FileStoreController.updateStore({...FileStoreController.data, bookmarks: n})
    }
    static paste (target, setCurrentDirectory) {
        if(FileStoreController.toCut.length > 0){
            handleDropFolder(
                [...FileStoreController.toCut],
                target,
                {id: target},
                setCurrentDirectory
            )
            FileStoreController.toCut = []
        }
    }
}