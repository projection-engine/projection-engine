import ContentBrowserStore from "../../shared/stores/ContentBrowserStore"
import SELECTION_TYPES from "../views/content-browser/static/SELECTION_TYPES"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import FileTypes from "../../../../shared/enums/FileTypes"
import ElectronResources from "../../shared/lib/ElectronResources"
import EngineResourceLoaderService from "../services/engine/EngineResourceLoaderService"
import LevelService from "../services/engine/LevelService"
import ShaderEditorTools from "../views/shader-editor/libs/ShaderEditorTools"
import VIEWS from "../components/view/static/VIEWS"
import EditorFSUtil from "./EditorFSUtil"
import FileSystemUtil from "../../shared/FileSystemUtil"
import {SORTS} from "../views/content-browser/static/SORT_INFO"
import COMPONENT_TEMPLATE from "../../../engine/core/static/templates/COMPONENT_TEMPLATE"
import UI_TEMPLATE from "../../../engine/core/static/templates/UI_TEMPLATE"
import EditorUtil from "./EditorUtil"
import ContentBrowserHierarchyStore from "../../shared/stores/ContentBrowserHierarchyStore"
import IPCRoutes from "../../../../shared/enums/IPCRoutes"
import getContentBrowserActions from "../templates/get-content-browser-actions"
import HotKeysController from "../../shared/lib/HotKeysController"
import ContextMenuService from "../../shared/lib/context-menu/ContextMenuService"
import NavigationHistory from "../views/content-browser/libs/NavigationHistory"

export default class ContentBrowserUtil {
    static sortItems(arr: MutableObject[], isDSC: boolean, sortKey: string) {
        function compare(A, B) {
            if (A[sortKey] < B[sortKey])
                return isDSC ? -1 : 1
            if (A[sortKey] > B[sortKey])
                return isDSC ? 1 : -1
            return 0
        }

        return arr.sort(compare)
    }

    static selection(type, currentDirectory) {
        const items = ContentBrowserStore.getData().items

        switch (type) {
            case SELECTION_TYPES.INVERT: {
                const linked = items.filter(i => i.id.includes(currentDirectory.id))
                const toSelect = []
                const selectedItems = ContentBrowserStore.getContentBrowserSelected()
                for (let i = 0; i < linked.length; i++) {
                    if (!selectedItems.includes(linked[i]))
                        toSelect.push(linked[i])
                }
                ContentBrowserStore.setContentBrowserSelected(toSelect)
                break
            }
            case SELECTION_TYPES.NONE:
                ContentBrowserStore.setContentBrowserSelected([])
                break
            case SELECTION_TYPES.ALL: {
                const linked = items.filter(i => i.id.includes(currentDirectory.id))
                ContentBrowserStore.setContentBrowserSelected(linked)
                break
            }
            default:
                break
        }
    }

    static openItem(data, setCurrentDirectory: Function, reset: Function) {
        if (!data)
            return
        if (!data.isFolder) {
            const fileType = "." + data.type
            ToastNotificationSystem.getInstance().warn(LocalizationEN.OPENING_ASSET + " (" + data.name + ")")
            switch (fileType) {
                case FileTypes.UI_LAYOUT:
                case FileTypes.COMPONENT:
                case FileTypes.JAVASCRIPT:
                case FileTypes.JSON:
                    ElectronResources.shell.openPath(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + data.id))
                        .catch(err => {
                            ToastNotificationSystem.getInstance().error(LocalizationEN.ERROR_OPENING_FILE)
                            console.error(err)
                        })
                    break
                case FileTypes.PRIMITIVE:
                case FileTypes.COLLECTION:
                case FileTypes.TEXTURE:
                    EngineResourceLoaderService.load(data.registryID, true).catch(console.error)
                    ToastNotificationSystem.getInstance().warn(LocalizationEN.CREATING_ENTITY)
                    break
                case FileTypes.LEVEL:
                    LevelService.getInstance().loadLevel(data.registryID).catch(console.error)
                    break
                case FileTypes.MATERIAL:
                    ShaderEditorTools.toOpenFile = data
                    EditorUtil.openBottomView(VIEWS.SHADER_EDITOR)
                    break
            }
        } else {
            reset()
            setCurrentDirectory(data)
        }
    }

    static handleSelection(e: MouseEvent, child: MutableObject) {
        let toSelect = []
        if (e) {
            if (e.ctrlKey)
                toSelect = [...ContentBrowserStore.getContentBrowserSelected(), child]
            else
                toSelect = [child]
        }
        ContentBrowserStore.setContentBrowserSelected(toSelect)
    }

    static async handleRename(item, newName, currentDirectory, setCurrentDirectory) {
        if (newName === item.name)
            return

        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + FileSystemUtil.sep + newName : FileSystemUtil.sep + newName)
            await ContentBrowserUtil.rename(FileSystemUtil.ASSETS_PATH + item.id, FileSystemUtil.ASSETS_PATH + newNamePath)
            await ContentBrowserUtil.refreshFiles().catch(console.error)
            if (item.id === currentDirectory.id)
                setCurrentDirectory({id: newNamePath})
            return
        }

        const nameToApply = newName + "." + item.type
        const targetPath = FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + (item.parent ? item.parent + FileSystemUtil.sep : FileSystemUtil.sep) + nameToApply)

        if (FileSystemUtil.exists(targetPath))
            return

        await ContentBrowserUtil.rename(FileSystemUtil.ASSETS_PATH + item.id, targetPath)
        await ContentBrowserUtil.refreshFiles().catch(console.error)
    }

    static async handleDropFolder(event: string[] | string, target?: string) {
        const itemsFilesStore = ContentBrowserStore.getData().items
        try {
            const items = Array.isArray(event) ? event : JSON.parse(event)
            for (let i = 0; i < items.length; i++) {
                const textData = items[i]

                if (target !== FileSystemUtil.sep) {
                    let from = textData
                    if (!from.includes(FileSystemUtil.sep)) {
                        const reg = EditorFSUtil.getRegistryEntry(from)
                        if (reg) from = reg.path
                        else {
                            console.error("Some error occurred")
                            return
                        }
                    }
                    const to = target + FileSystemUtil.sep + from.split(FileSystemUtil.sep).pop()

                    const toItem = itemsFilesStore.find(f => f.id === target)
                    const fromItem = itemsFilesStore.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
                    if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                        await ContentBrowserUtil.rename(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + from), FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + to))
                        await ContentBrowserUtil.refreshFiles()
                    }
                } else if (textData.includes(FileSystemUtil.sep)) {
                    const newPath = FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + textData.split(FileSystemUtil.sep).pop()
                    if (!FileSystemUtil.exists(newPath)) {
                        await ContentBrowserUtil.rename(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + textData), FileSystemUtil.resolvePath(newPath))
                        await ContentBrowserUtil.refreshFiles()
                    } else ToastNotificationSystem.getInstance().error(LocalizationEN.ITEM_ALREADY_EXISTS)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    static async handleDelete(entries, currentDirectory, setCurrentDirectory) {
        const items = ContentBrowserStore.getData().items
        const itemsToDelete = !Array.isArray(entries) ? [entries] : entries

        ToastNotificationSystem.getInstance().warn(LocalizationEN.DELETING_ITEMS)
        for (let i = 0; i < itemsToDelete.length; i++) {
            const currentItem = itemsToDelete[i]
            const file = items.find(e => e.id === currentItem)
            if (!file)
                continue
            const relatedFiles = items.filter(item => item.id.includes(currentItem.id))
            for (let j = 0; j < relatedFiles.length; j++) {
                const currentFile = relatedFiles[j]
                await FileSystemUtil.deleteFile(
                    FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + currentFile.id,
                    {
                        recursive: true,
                        force: true
                    })
                if (currentDirectory.id === currentFile.id)
                    setCurrentDirectory({id: FileSystemUtil.sep})
            }
            await FileSystemUtil.deleteFile(
                FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + file.id,
                {
                    recursive: true,
                    force: true
                })
            if (currentDirectory.id === file.id)
                setCurrentDirectory({id: FileSystemUtil.sep})
        }

        await ContentBrowserUtil.refreshFiles().catch(console.error)
        ToastNotificationSystem.getInstance().success(LocalizationEN.SUCCESSFUL_DELETE)
    }

    static getTypeName(type: string): string {
        switch ("." + type) {
            case FileTypes.PRIMITIVE:
                return "Mesh"
            case FileTypes.LEVEL:
                return "Level"
            case FileTypes.UI_LAYOUT:
                return "UI layout"
            case FileTypes.COMPONENT:
                return "Component"
            case FileTypes.MATERIAL:
                return "Material"
            case FileTypes.TEXTURE:
                return "Texture"
            case FileTypes.COLLECTION:
                return "Scene"
            case FileTypes.JAVASCRIPT:
                return "Javascript package"
            case FileTypes.JSON:
                return "JSON object"
        }
    }

    static getItemIcon(data): string {
        if (data.isFolder)
            return data.children === 0 ? "folder_open" : "folder"
        else
            switch ("." + data.type) {
                case FileTypes.COMPONENT:
                    return "code"
                case FileTypes.COLLECTION:
                    return "inventory_2"
                case FileTypes.LEVEL:
                    return "forest"
                case FileTypes.UI_LAYOUT:
                    return "view_quilt"
                case FileTypes.JAVASCRIPT:
                    return "javascript"
                case FileTypes.JSON:
                    return "data_object"
            }
    }

    static getItemDragImage(data) {
        let body
        if (!data.isFolder)
            body = `
                <div>
                    <strong>${LocalizationEN.ITEM_TYPE}:</strong>
                    <small>${LocalizationEN["." + data.type]}</small>
                </div>
                <div>
                    <strong>${LocalizationEN.REGISTRY_ID}:</strong>
                    <small>${data.registryID}</small>
                </div>
            `
        else
            body = `
                <div>
                    <strong>${LocalizationEN.CHILDREN}:</strong>
                    <small>${data.children}</small>
                </div>
            `
        return `
             <div style="   display: grid;">
                <div>
                    <strong>${LocalizationEN.ITEM_NAME}: </strong>
                    <small>${data.name}</small>
                </div>
                ${body}
            </div>
        `
    }

    static getItemDragData( data, setOnDrag: Function) {
        return {
            dragImage: `
                <span data-svelteicon="-" style="font-size: 70px">${ContentBrowserUtil.#getDragIcon(ContentBrowserUtil.getItemIcon(data), data)}</span>
                ${data.name}
            `,
            onDragOver: () => data.isFolder ? "Link folder" : undefined,
            onDragEnd: () => setOnDrag(false),
            onDragStart: () => {
                setOnDrag(true)
                const selectedItems = ContentBrowserStore.getContentBrowserSelected()
                if (selectedItems.length > 0)
                    return JSON.stringify(selectedItems.map(s => s?.registryID))
                return JSON.stringify([!data.isFolder ? data.registryID : data.id])
            }
        }
    }

    static #getDragIcon(icon: string, data) {
        if (icon)
            return icon
        if (data.isFolder)
            return !data.children ? "folder_open" : "folder"
        if (("." + data.type) === FileTypes.PRIMITIVE)
            return "category"
        return "texture"
    }

    static #map(check, items, elementsPerRow) {
        const newArr = []
        let offset = 0
        for (let i = 0; i < items.length; i++) {

            const current = items[i]
            if (!check(current))
                continue
            if (!newArr[offset])
                newArr[offset] = []

            current.children = current.isFolder ? items.filter(i => typeof i.parent === "string" && i.parent === current.id).length : 0
            newArr[offset].push(current)
            if (newArr[offset].length >= elementsPerRow)
                offset += 1
        }
        return newArr
    }

    static getFilesToRender(currentDirectory, fileType, itemsToMap, inputValue, elementsPerRow, sortKey, sortDirection) {
        if (!itemsToMap)
            return []

        let type = fileType?.split("")
        if (type) {
            type.shift()
            type = type.join("")
        }
        const items = ContentBrowserUtil.sortItems(itemsToMap, sortDirection === SORTS[1], sortKey)

        if (inputValue || fileType)
            return ContentBrowserUtil.#map(
                file => inputValue.trim() && file.name.includes(inputValue) || type && file.type === type && !file.isFolder,
                items,
                elementsPerRow
            )
        if (currentDirectory.id !== FileSystemUtil.sep)
            return ContentBrowserUtil.#map(
                file => file.parent === currentDirectory.id,
                items,
                elementsPerRow
            )

        return ContentBrowserUtil.#map(file => !file.parent, items, elementsPerRow)
    }

    static getFileTypes() {
        const c = {...FileTypes}
        return Object.keys(c).map(m => m === FileTypes.PROJECT ? undefined : [m, LocalizationEN[m]]).filter(e => e[1] != null)
    }

    static async #createFile(currentDirectory, name, type, data) {
        const path = await EditorUtil.resolveFileName(currentDirectory.id + FileSystemUtil.sep + name, type)
        await EditorFSUtil.writeAsset(path, typeof data === "object" ? JSON.stringify(data) : data)
        await ContentBrowserUtil.refreshFiles()
    }

    static getCreationOptions(currentDirectory) {
        return [
            {
                label: LocalizationEN.FOLDER,
                onClick: () => ContentBrowserUtil.createFolder(currentDirectory).catch(console.error)
            },
            {divider: true},
            {
                label: LocalizationEN.JSON_OBJECT,
                onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.JSON, FileTypes.JSON, "")
            },
            {
                label: LocalizationEN.JAVASCRIPT_PACKAGE,
                onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.JAVASCRIPT, FileTypes.JAVASCRIPT, "")
            },
            {divider: true},
            {
                label: LocalizationEN.LEVEL,
                onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.LEVEL, FileTypes.LEVEL, {entities: []})
            },
            {divider: true},
            {
                label: LocalizationEN.MATERIAL,
                onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.MATERIAL, FileTypes.MATERIAL, {})
            },

            {divider: true},
            {
                label: LocalizationEN.COMPONENT,
                onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.COMPONENT, FileTypes.COMPONENT, COMPONENT_TEMPLATE)
            },
            {
                label: LocalizationEN.UI_LAYOUT,
                onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.UI_LAYOUT, FileTypes.UI_LAYOUT, UI_TEMPLATE)
            },

        ]
    }


    static initializeContentBrowser() {
        ContentBrowserStore.getInstance().addListener("self-update", () => {
            ContentBrowserHierarchyStore.updateStore({})
        })
        ContentBrowserUtil.refreshFiles().catch(console.error)
    }


    static async refreshFiles() {
        const instance = ContentBrowserStore.getInstance()
        try {
            const items = await EditorUtil.getCall(IPCRoutes.REFRESH_CONTENT_BROWSER, {pathName: FileSystemUtil.path + FileSystemUtil.sep}, false)
            const fileTypes = await ContentBrowserUtil.getRegistryData()
            instance.updateStore({items: items ?? instance.data.items, ...fileTypes})
        } catch (err) {
            console.error(err)
        }
    }

    static getFilesToCut() {
        return ContentBrowserStore.getData().toCut
    }

    static cutFiles(toCut: string[]) {
        ContentBrowserStore.updateStore({toCut})
    }

    static paste(target?: string) {
        if (ContentBrowserUtil.getFilesToCut().length > 0) {
            ContentBrowserUtil.handleDropFolder(
                ContentBrowserUtil.getFilesToCut(),
                target
            )
                .catch(err => console.error(err))
                .finally(() => ContentBrowserUtil.cutFiles([]))
        }
    }

    static async createFolder(currentDirectory) {
        const path = await EditorUtil.resolveFileName(currentDirectory.id + FileSystemUtil.sep + LocalizationEN.NEW_FOLDER, "")
        await FileSystemUtil.mkdir(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + path)
        await ContentBrowserUtil.refreshFiles()
    }

    static updateHierarchy() {
        const items = ContentBrowserStore.getData().items
        if (!items)
            return
        const open = ContentBrowserHierarchyStore.getData().open
        const folders = items.filter(item => item.isFolder)
        const cache = {
            [FileSystemUtil.sep]: {
                depth: 0,
                item: {id: FileSystemUtil.sep, name: "Assets", isFolder: true},
                childQuantity: folders.length
            }
        }
        if (open[FileSystemUtil.sep]) {
            for (let i = 0; i < folders.length; i++) {
                const item = folders[i]
                if (item.parent)
                    continue
                ContentBrowserUtil.#getHierarchy(cache, item, 1, folders)
            }
        }
        return Object.values(cache)
    }

    static #getHierarchy(cache, item, depth = 0, folders) {
        cache[item.id] = {item, depth, childQuantity: 0, children: []}
        const isOpen = ContentBrowserHierarchyStore.getData().open[item.id]
        for (let i = 0; i < folders.length; i++) {
            const current = folders[i]
            if (current.parent === item.id && !cache[current.id]) {
                cache[item.id].childQuantity++
                cache[item.id].children.push(current.id)
                if (isOpen)
                    ContentBrowserUtil.#getHierarchy(cache, current, depth + 1, folders)
            }
        }
    }

    static buildContextMenuAndHotKeys(
        COMPONENT_ID: string,
        ref: HTMLElement,
        navigationHistory: typeof NavigationHistory,
        getCurrentDirectory: Function,
        setCurrentDirectory: Function,
        setCurrentItem: Function
    ) {
        const actions = getContentBrowserActions(navigationHistory, getCurrentDirectory, setCurrentDirectory, setCurrentItem)
        HotKeysController.unbindAction(ref)
        ContextMenuService.getInstance().destroy(COMPONENT_ID)
        ContextMenuService.getInstance().mount(
            actions.contextMenu,
            COMPONENT_ID,
            (trigger, element) => {
                const id = element.getAttribute("data-svelteid")

                if (id != null) {
                    const item = ContentBrowserStore.getItemById(id)
                    if (item)
                        ContentBrowserStore.setContentBrowserSelected([item])
                }
            }
        )
        HotKeysController.bindAction(
            ref,
            actions.hotKeys,
            "folder",
            LocalizationEN.CONTENT_BROWSER
        )
    }

    static #mapRegistryAsset(reg, type) {
        const split = reg.path.split(FileSystemUtil.sep)
        return {
            type,
            registryID: reg.id,
            name: split[split.length - 1].split(".")[0]
        }
    }

    static async rename(from, to) {
        const fromResolved = ElectronResources.path.resolve(from)
        const toResolved = ElectronResources.path.resolve(to)
        await EditorFSUtil.readRegistry()
        try {
            const stat = await FileSystemUtil.stat(fromResolved)
            if (stat !== undefined && stat.isDirectory) {
                await FileSystemUtil.mkdir(toResolved)
                const res = await FileSystemUtil.readdir(fromResolved)
                if (!res) return
                for (let i = 0; i < res.length; i++) {
                    const file = res[i]
                    const oldPath = fromResolved + FileSystemUtil.sep + `${file}`
                    const newPath = toResolved + FileSystemUtil.sep + `${file}`
                    if ((await FileSystemUtil.stat(oldPath)).isDirectory)
                        await FileSystemUtil.rename(oldPath, newPath)
                    else {
                        await FileSystemUtil.rename(oldPath, newPath)
                        await EditorFSUtil.updateRegistry(oldPath, newPath)
                    }
                }
                await FileSystemUtil.rm(fromResolved, {recursive: true, force: true})
                return
            }

            if (stat !== undefined) {
                await FileSystemUtil.rename(fromResolved, toResolved)
                await EditorFSUtil.updateRegistry(fromResolved, toResolved)
                return
            }

        } catch (error) {
            console.error(error)
        }
    }

    static async getRegistryData() {
        const result = {
            textures: [],
            meshes: [],
            materials: [],
            components: [],
            terrains: [],
            levels: [],
            uiLayouts: [],
            materialInstances: [],
            terrainMaterials: [],
            collections: []
        }
        await EditorFSUtil.readRegistry()
        const registryList = EditorFSUtil.registryList
        for (let i = 0; i < registryList.length; i++) {
            const registryEntry = registryList[i]
            if (!registryEntry.path)
                continue
            let type
            let slot
            switch (true) {
                case registryEntry.path.includes(FileTypes.TEXTURE):
                    type = FileTypes.TEXTURE
                    slot = result.textures
                    break
                case registryEntry.path.includes(FileTypes.PRIMITIVE):
                    type = FileTypes.PRIMITIVE
                    slot = result.meshes
                    break
                case registryEntry.path.includes(FileTypes.MATERIAL):
                    type = FileTypes.MATERIAL
                    slot = result.materials
                    break
                case registryEntry.path.includes(FileTypes.COMPONENT):
                    type = FileTypes.COMPONENT
                    slot = result.components
                    break
                case registryEntry.path.includes(FileTypes.LEVEL):
                    type = FileTypes.LEVEL
                    slot = result.levels
                    break
                case registryEntry.path.includes(FileTypes.UI_LAYOUT):
                    type = FileTypes.UI_LAYOUT
                    slot = result.uiLayouts
                    break
                case registryEntry.path.includes(FileTypes.COLLECTION):
                    type = FileTypes.COLLECTION
                    slot = result.collections
                    break
            }
            if (type && slot)
                slot.push(ContentBrowserUtil.#mapRegistryAsset(registryEntry, type))
        }

        return result
    }

}
