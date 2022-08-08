import {get} from "svelte/store";
import {fileStore} from "./file-store";
import {getCall} from "../../../libs/AsyncFS";
import FileSystem from "../../../libs/FileSystem"
import handleDropFolder from "../views/content-browser/utils/handle-drop-folder";
import ROUTES from "../../../../static/ROUTES";

export default class FileStoreController {
    static data = get(fileStore)
    static initialized = false
    static toCut = []

    static get ASSETS_PATH() {
        return window.fileSystem.path + FileSystem.sep + "assets"
    }

    static getStore(onChange) {
        if (!FileStoreController.initialized) {
            window
                .fileSystem
                .readFile(window.fileSystem.path + FileSystem.sep + "bookmarks.meta", "json")
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
            const fileTypes = await window.fileSystem.refresh(false)
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
        window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FileStoreController.updateStore({...FileStoreController.data, bookmarks: n})
    }

    static addBookmark(id) {
        const prev = FileStoreController.data.bookmarks

        const n = [...prev, {
            name: id.split(FileSystem.sep).pop(),
            path: id
        }]
        window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FileStoreController.updateStore({...FileStoreController.data, bookmarks: n})
    }

    static removeBookmark(id) {
        const prev = FileStoreController.data.bookmarks

        const n = prev.filter(i => i.path !== id)
        window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FileStoreController.updateStore({...FileStoreController.data, bookmarks: n})
    }

    static renameBookmark(id, newPath) {
        const prev = FileStoreController.data.bookmarks
        const p = prev.filter(i => i.path !== id)
        const n = [...p, {
            name: newPath.split(FileSystem.sep).pop(),
            path: newPath
        }]
        window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
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