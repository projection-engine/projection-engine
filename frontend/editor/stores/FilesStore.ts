import {get, writable} from "svelte/store";
import handleDropFolder from "../views/content-browser/utils/handle-drop-folder";
import ROUTES from "../../../backend/static/ROUTES.ts";
import ContentBrowserAPI from "../lib/fs/ContentBrowserAPI";
import Localization from "../templates/LOCALIZATION_EN";
import resolveFileName from "../templates/utils/resolve-file-name";
import FilesHierarchyStore from "./FilesHierarchyStore";

const contentBrowserStore = writable({
    isLoading: true,
    items: [],
    textures: [],
    meshes: [],
    levels: [],
    materials: [],
    materialInstances: [],
    simpleMaterials: [],
    components: [],
    uiLayouts: [],
    terrains: [],
    terrainMaterials: [],
    toCut: [],
    collections: []
});

export default class FilesStore {
    static data = get(contentBrowserStore)
    static initialized = false

    static #isWatching = false


    static getStore(onChange) {
        if (!FilesStore.initialized) {
            FilesStore.initialized = true
            contentBrowserStore.subscribe(data => {
                FilesHierarchyStore.update(data.items)
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