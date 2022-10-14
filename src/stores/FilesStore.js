import {get} from "svelte/store";
import {contentBrowserStore} from "./templates/content-browser-store";
import NodeFS, {getCall} from "shared-resources/frontend/libs/NodeFS"
import FilesAPI from "../libs/libs/FilesAPI"
import handleDropFolder from "../views/content-browser/utils/handle-drop-folder";
import ROUTES from "../data/ROUTES";
import ContentBrowserAPI from "../libs/libs/ContentBrowserAPI";
import Localization from "../libs/libs/Localization";
import {COMPONENTS, Engine} from "../../public/engine/production";
import UIAPI from "../../public/engine/production/apis/UIAPI";
import resolveFileName from "../templates/utils/resolve-file-name";

export default class FilesStore {
    static data = get(contentBrowserStore)
    static initialized = false

    static #isWatching = false


    static getStore(onChange) {
        if (!FilesStore.initialized) {
            FilesStore.initialized = true
            FilesAPI.readFile(NodeFS.path + NodeFS.sep + "bookmarks.meta", "json")
                .then(res => {
                    if (res)
                        FilesStore.updateStore({...FilesStore.data, bookmarks: res})
                })
            FilesStore.refreshFiles().catch()
        }
        return contentBrowserStore.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static async refreshFiles() {
        try {
            console.log(NodeFS.path)
            const data = await getCall(ROUTES.REFRESH_CONTENT_BROWSER, {pathName: NodeFS.path + NodeFS.sep}, false)
            const fileTypes = await ContentBrowserAPI.refresh()
            FilesStore.updateStore({...FilesStore.data, items: data, ...fileTypes})
        } catch (err) {
            console.error(err)
        }

    }

    static unwatchFiles() {
        if (!FilesStore.#isWatching)
            return
        NodeFS.unwatch()
        FilesStore.#isWatching = false
    }

    static watchFiles() {
        if (FilesStore.#isWatching)
            return
        FilesStore.#isWatching = true
        NodeFS.watch(async (ev, data) => {
            const found = FilesStore.data.items.find(i => !i.isFolder && data.includes(i.id))
            if (found && Engine.UILayouts.get(found.registryID) != null) {
                const entity = Engine.entities.find(e => e.components.get(COMPONENTS.UI)?.uiLayoutID === found.registryID)
                if (!entity) {
                    Engine.UILayouts.delete(found.registryID)
                    return
                }
                Engine.UILayouts.set(found.registryID, await FilesAPI.readFile(data))
                UIAPI.updateUIEntity(entity)
                alert.pushAlert("Updating entity UI", "info")
            }
        })
    }

    static async createFolder(currentDirectory) {
        let path = await resolveFileName(currentDirectory.id + NodeFS.sep + Localization.PROJECT.FILES.NEW_FOLDER, "")
        console.log(path)

        await NodeFS.mkdir(NodeFS.ASSETS_PATH + NodeFS.sep + path)
        await FilesStore.refreshFiles()

        if (FilesStore.#isWatching)
            NodeFS.reWatch()
    }

    static updateStore(value = FilesStore.data) {
        FilesStore.data = value
        contentBrowserStore.set({...value})
    }

    static removeBlock(v) {
        const prev = FilesStore.data.bookmarks
        const n = prev.filter(i => !v.includes(i.path))
        FilesAPI.writeFile(NodeFS.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FilesStore.updateStore({...FilesStore.data, bookmarks: n})
    }

    static addBookmark(id) {
        const prev = FilesStore.data.bookmarks

        const n = [...prev, {
            name: id.split(NodeFS.sep).pop(),
            path: id
        }]
        FilesAPI.writeFile(NodeFS.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FilesStore.updateStore({...FilesStore.data, bookmarks: n})
    }

    static removeBookmark(id) {
        const prev = FilesStore.data.bookmarks

        const n = prev.filter(i => i.path !== id)
        FilesAPI.writeFile(NodeFS.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FilesStore.updateStore({...FilesStore.data, bookmarks: n})
    }

    static renameBookmark(id, newPath) {
        const prev = FilesStore.data.bookmarks
        const p = prev.filter(i => i.path !== id)
        const n = [...p, {
            name: newPath.split(NodeFS.sep).pop(),
            path: newPath
        }]
        FilesAPI.writeFile(NodeFS.sep + "bookmarks.meta", JSON.stringify(n)).catch()
        FilesStore.updateStore({...FilesStore.data, bookmarks: n})
    }

    static paste(target, setCurrentDirectory) {
        if (FilesStore.data.toCut.length > 0) {
            handleDropFolder(
                [...FilesStore.data.toCut],
                target,
                {id: target},
                setCurrentDirectory
            )
            FilesStore.data.toCut = []
        }
    }
}