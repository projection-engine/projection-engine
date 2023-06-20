import FilesStore from "../../shared/stores/FilesStore"
import SELECTION_TYPES from "../views/content-browser/static/SELECTION_TYPES"
import SelectionStore from "../../shared/stores/SelectionStore"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../shared/LocalizationEN"
import FileTypes from "../../../shared/FileTypes"
import ElectronResources from "../../shared/lib/ElectronResources"
import FileSystemService from "../../shared/lib/FileSystemService"
import EngineResourceLoaderService from "../services/engine/EngineResourceLoaderService"
import LevelService from "../services/engine/LevelService"
import ShaderEditorTools from "../views/shader-editor/libs/ShaderEditorTools"
import VIEWS from "../components/view/static/VIEWS"
import ContentBrowserAPI from "../services/file-system/ContentBrowserAPI"
import FSRegistryService from "../services/file-system/FSRegistryService"
import FSFilesService from "../services/file-system/FSFilesService"
import {SORTS} from "../views/content-browser/static/SORT_INFO"
import FSAssetUtil from "../services/file-system/FSAssetUtil"
import COMPONENT_TEMPLATE from "../../../engine-core/static/templates/COMPONENT_TEMPLATE"
import UI_TEMPLATE from "../../../engine-core/static/templates/UI_TEMPLATE"
import EditorUtil from "./EditorUtil"

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
		const items = FilesStore.data.items

		switch (type) {
		case SELECTION_TYPES.INVERT: {
			const linked = items.filter(i => i.id.includes(currentDirectory.id))
			const toSelect = []

			for (let i = 0; i < linked.length; i++) {
				if (!SelectionStore.map.get(linked[i].id))
					toSelect.push(linked[i].id)
			}
			SelectionStore.contentBrowserSelected = toSelect
			break
		}
		case SELECTION_TYPES.NONE:
			SelectionStore.contentBrowserSelected = []
			break
		case SELECTION_TYPES.ALL: {
			const linked = items.filter(i => i.id.includes(currentDirectory.id))
			SelectionStore.contentBrowserSelected = linked.map(l => l.id)
			break
		}
		default:
			break
		}
	}

	static openItem(data, setCurrentDirectory, setSelected, reset, type) {
		if (!data)
			return
		if (type === 1) {
			const fileType = "." + data.type
			ToastNotificationSystem.getInstance().warn(LocalizationEN.OPENING_ASSET + " (" + data.name + ")")
			switch (fileType) {
			case FileTypes.UI_LAYOUT:
			case FileTypes.COMPONENT:
			case ".js":
			case ".json":
				ElectronResources.shell.openPath(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + data.id))
					.catch(err => {
						ToastNotificationSystem.getInstance().error(LocalizationEN.ERROR_OPENING_FILE)
						console.error(err)
					})
				break
			case FileTypes.PRIMITIVE:
			case FileTypes.COLLECTION:
			case FileTypes.TEXTURE:
				EngineResourceLoaderService.load(data.registryID, true).catch()
				ToastNotificationSystem.getInstance().warn(LocalizationEN.CREATING_ENTITY)
				break
			case FileTypes.LEVEL:
				LevelService.getInstance().loadLevel(data.registryID).catch()
				break
			case FileTypes.MATERIAL:
				ShaderEditorTools.toOpenFile = data
				EditorUtil.openBottomView(VIEWS.SHADER_EDITOR)
				break
			default:
				setSelected(data.id)
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
				toSelect = [...SelectionStore.contentBrowserSelected, child.id]
			else
				toSelect = [child.id]
		}
		SelectionStore.contentBrowserSelected = toSelect
	}

	static async handleRename(item, newName, currentDirectory, setCurrentDirectory) {
		if (newName === item.name)
			return

		if (item.isFolder) {
			const newNamePath = (item.parent ? item.parent + FileSystemService.getInstance().sep + newName : FileSystemService.getInstance().sep + newName)
			await ContentBrowserAPI.rename(FileSystemService.getInstance().ASSETS_PATH + item.id, FileSystemService.getInstance().ASSETS_PATH + newNamePath)
			await FilesStore.refreshFiles().catch()
			if (item.id === currentDirectory.id)
				setCurrentDirectory({id: newNamePath})
			return
		}

		const nameToApply = newName + "." + item.type
		const targetPath = FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + (item.parent ? item.parent + FileSystemService.getInstance().sep : FileSystemService.getInstance().sep) + nameToApply)

		if (FileSystemService.getInstance().exists(targetPath))
			return

		await ContentBrowserAPI.rename(FileSystemService.getInstance().ASSETS_PATH + item.id, targetPath)
		await FilesStore.refreshFiles().catch()
	}

	static async handleDropFolder(event: string[] | string, target?: string) {
		try {
			const items = Array.isArray(event) ? event : JSON.parse(event)
			for (let i = 0; i < items.length; i++) {
				const textData = items[i]

				if (target !== FileSystemService.getInstance().sep) {
					let from = textData
					if (!from.includes(FileSystemService.getInstance().sep)) {
						const reg = FSRegistryService.getRegistryEntry(from)
						if (reg) from = reg.path
						else {
							console.error("Some error occurred")
							return
						}
					}
					const to = target + FileSystemService.getInstance().sep + from.split(FileSystemService.getInstance().sep).pop()

					const toItem = FilesStore.data.items.find(f => f.id === target)
					const fromItem = FilesStore.data.items.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
					if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
						await ContentBrowserAPI.rename(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + from), FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + to))
						await FilesStore.refreshFiles()
					}
				} else if (textData.includes(FileSystemService.getInstance().sep)) {
					const newPath = FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + textData.split(FileSystemService.getInstance().sep).pop()
					if (!FileSystemService.getInstance().exists(newPath)) {
						await ContentBrowserAPI.rename(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + textData), FileSystemService.getInstance().resolvePath(newPath))
						await FilesStore.refreshFiles()
					} else ToastNotificationSystem.getInstance().error(LocalizationEN.ITEM_ALREADY_EXISTS)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	static async handleDelete(entries, currentDirectory, setCurrentDirectory) {
		const itemsToDelete = !Array.isArray(entries) ? [entries] : entries

		ToastNotificationSystem.getInstance().warn(LocalizationEN.DELETING_ITEMS)
		for (let i = 0; i < itemsToDelete.length; i++) {
			const currentItem = itemsToDelete[i]
			const file = FilesStore.data.items.find(e => e.id === currentItem)
			if (!file)
				continue
			const relatedFiles = FilesStore.data.items.filter(item => item.id.includes(currentItem.id))
			for (let j = 0; j < relatedFiles.length; j++) {
				const currentFile = relatedFiles[j]
				await FSFilesService.deleteFile(
					FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + currentFile.id,
					{
						recursive: true,
						force: true
					})
				if (currentDirectory.id === currentFile.id)
					setCurrentDirectory({id: FileSystemService.getInstance().sep})
			}
			await FSFilesService.deleteFile(
				FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + file.id,
				{
					recursive: true,
					force: true
				})
			if (currentDirectory.id === file.id)
				setCurrentDirectory({id: FileSystemService.getInstance().sep})
		}

		await FilesStore.refreshFiles().catch()
		ToastNotificationSystem.getInstance().success(LocalizationEN.SUCCESSFUL_DELETE)
	}

	static getTypeName(type) {
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
		case ".js":
			return "Javascript package"
		case ".json":
			return "JSON object"
		default:
			return ""
		}
	}

	static getItemIcon(metadata, type) {
		let icon
		if (type === 0)
			icon = metadata.childQuantity === 0 ? "folder_open" : "folder"
		else
			switch (metadata.type) {
			case FileTypes.COMPONENT:
				icon = "code"
				break
			case FileTypes.COLLECTION:
				icon = "inventory_2"
				break
			case FileTypes.LEVEL:
				icon = "forest"
				break
			case FileTypes.UI_LAYOUT:
				icon = "view_quilt"
				break

			case ".js":
				icon = "javascript"
				break
			case ".json":
				icon = "data_object"
				break
			}


		return icon
	}

	static getItemDragImage(data, type, metadata) {
		let body
		if (type !== 0)
			body = `
                <div>
                    <strong>${LocalizationEN.ITEM_TYPE}:</strong>
                    <small>${metadata.typeName}</small>
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
                    <small>${metadata.childQuantity}</small>
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

	static getItemDragData(icon, childQuantity, data, items, setOnDrag, type, metadata) {
		return {
			dragImage: `
                <span data-svelteicon="-" style="font-size: 70px">${ContentBrowserUtil.getIcon(icon, metadata, childQuantity, type)}</span>
                ${data.name}
            `,
			onDragOver: () => type === 0 ? "Link folder" : undefined,
			onDragEnd: () => setOnDrag(false),
			onDragStart: () => {
				setOnDrag(true)
				const ss = SelectionStore.contentBrowserSelected.map(s => items.find(i => i.id === s))
				if (ss.length > 0)
					return JSON.stringify(ss.map(s => s?.registryID))
				return JSON.stringify([type === 1 ? data.registryID : data.id])
			}
		}
	}

	static getIcon(icon, metadata, childQuantity, type) {
		if (icon)
			return icon
		if (type === 0)
			return childQuantity === 0 ? "folder_open" : "folder"
		if (metadata.type === FileTypes.PRIMITIVE)
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
		if (currentDirectory.id !== FileSystemService.getInstance().sep)
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
		const path = await EditorUtil.resolveFileName(currentDirectory.id + FileSystemService.getInstance().sep + name, type)
		await FSAssetUtil.writeAsset(path, typeof data === "object" ? JSON.stringify(data) : data)
		await FilesStore.refreshFiles()
	}

	static getCreationOptions(currentDirectory) {
		return [
			{
				label: LocalizationEN.FOLDER,
				onClick: () => FilesStore.createFolder(currentDirectory).catch()
			},
			{divider: true},
			{
				label: LocalizationEN.JSON_OBJECT,
				onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.JSON, ".json", "")
			},
			{
				label: LocalizationEN.JAVASCRIPT_PACKAGE,
				onClick: async () => ContentBrowserUtil.#createFile(currentDirectory, LocalizationEN.JAVASCRIPT, ".js", "")
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
}