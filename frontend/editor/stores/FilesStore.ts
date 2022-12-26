import {get, writable} from "svelte/store";
import handleDropFolder from "../views/content-browser/utils/handle-drop-folder";
import ROUTES from "../../../backend/static/ROUTES";
import ContentBrowserAPI from "../lib/fs/ContentBrowserAPI";
import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
import resolveFileName from "../utils/resolve-file-name";
import FilesHierarchyStore from "./FilesHierarchyStore";
import NodeFS from "../../lib/FS/NodeFS";
import {getCall} from "../../lib/FS/get-call";
import MutableObject from "../../../engine-core/MutableObject";

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
    static #initialized = false

    static initializeContentBrowser(){
        if (!FilesStore.#initialized) {
            FilesStore.#initialized = true
            contentBrowserStore.subscribe(data => {
                FilesHierarchyStore.update(data.items)
            })
            FilesStore.refreshFiles().catch()

        }
    }
    static getStore(onChange) {
        return contentBrowserStore.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static async refreshFiles() {
        try {
            const data = <MutableObject[]>(await getCall(ROUTES.REFRESH_CONTENT_BROWSER, {pathName: NodeFS.path + NodeFS.sep}, false))
            console.trace(data)
            const fileTypes = await ContentBrowserAPI.refresh()

            FilesStore.updateStore({...FilesStore.data, items: data, ...fileTypes})
        } catch (err) {
            console.error(err)
        }
    }



    static async createFolder(currentDirectory) {
        let path = await resolveFileName(currentDirectory.id + NodeFS.sep + LOCALIZATION_EN.NEW_FOLDER, "")
        await NodeFS.mkdir(NodeFS.ASSETS_PATH + NodeFS.sep + path)
        await FilesStore.refreshFiles()
    }

    static updateStore(value = FilesStore.data) {
        FilesStore.data = value
        contentBrowserStore.set({...value})
    }


    static paste(target?:string) {
        if (FilesStore.data.toCut.length > 0) {
            handleDropFolder(
                [...FilesStore.data.toCut],
                target
            ).catch(err => console.error(err))
            FilesStore.data.toCut = []
        }
    }
}