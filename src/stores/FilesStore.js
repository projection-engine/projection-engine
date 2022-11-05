import {get} from "svelte/store";
import {contentBrowserStore} from "./templates/content-browser-store";
import NodeFS, {getCall} from "shared-resources/frontend/libs/NodeFS"
import handleDropFolder from "../views/content-browser/utils/handle-drop-folder";
import ROUTES from "../data/ROUTES";
import ContentBrowserAPI from "../libs/ContentBrowserAPI";
import Localization from "../templates/LOCALIZATION_EN";
import resolveFileName from "../templates/utils/resolve-file-name";
import FilesHierarchyStore from "./FilesHierarchyStore";

export default class FilesStore {
    static data = get(contentBrowserStore)
    static initialized = false

    static #isWatching = false


    static getStore(onChange) {
        if (!FilesStore.initialized) {
            FilesStore.initialized = true
            contentBrowserStore.subscribe(data => {
                FilesHierarchyStore.update(data.items)
                console.log(data)
            })
            FilesStore.refreshFiles().catch()

        }
        return contentBrowserStore.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static async refreshFiles() {
        try {
            const data = await getCall(ROUTES.REFRESH_CONTENT_BROWSER, {pathName: NodeFS.path + NodeFS.sep}, false)
            const fileTypes = await ContentBrowserAPI.refresh()
            FilesStore.updateStore({...FilesStore.data, items: data, ...fileTypes})
        } catch (err) {
            console.error(err)
        }
    }



    static async createFolder(currentDirectory) {
        let path = await resolveFileName(currentDirectory.id + NodeFS.sep + Localization.NEW_FOLDER, "")
        await NodeFS.mkdir(NodeFS.ASSETS_PATH + NodeFS.sep + path)
        await FilesStore.refreshFiles()

        if (FilesStore.#isWatching)
            NodeFS.reWatch()
    }

    static updateStore(value = FilesStore.data) {
        FilesStore.data = value
        contentBrowserStore.set({...value})
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