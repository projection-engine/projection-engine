import SELECTION_TYPES from "../views/content-browser/static/SELECTION_TYPES"
import FSRegistryService from "../services/file-system/FSRegistryService"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import ElectronResources from "../../shared/lib/ElectronResources"
import LocalizationEN from "../../../shared/LocalizationEN"
import ContentBrowserUtil from "../util/ContentBrowserUtil"
import EditorUtil from "../util/EditorUtil"
import SelectionStoreUtil from "../util/SelectionStoreUtil"
import FileSystemUtil from "../../shared/FileSystemUtil"
import SettingsStore from "../../stores/SettingsStore"

export default function getContentBrowserActions(navigationHistory, currentDirectory, setCurrentDirectory, setCurrentItem) {
	const contentBrowserHotkeys = SettingsStore.getData().contentBrowserHotkeys
	const hotKeys = {
		BACK: {
			label: "Go back",
			require: contentBrowserHotkeys.BACK,
			callback: () => navigationHistory.undo()
		},
		FORWARD: {
			label: "Go forward",
			require: contentBrowserHotkeys.FORWARD,
			callback: () => navigationHistory.redo()
		},

		SELECT_ALL: {
			label: "Select all",
			require: contentBrowserHotkeys.SELECT_ALL,
			callback: () => ContentBrowserUtil.selection(SELECTION_TYPES.ALL, currentDirectory)
		},
		SELECT_NONE: {
			label: "Select none",
			require: contentBrowserHotkeys.SELECT_NONE,
			callback: () => ContentBrowserUtil.selection(SELECTION_TYPES.NONE, currentDirectory)
		},
		INVERT_SELECTION: {
			label: "Invert selection",

			require: contentBrowserHotkeys.INVERT_SELECTION,
			callback: () => ContentBrowserUtil.selection(SELECTION_TYPES.INVERT, currentDirectory)
		},
		REFRESH: {
			label: "Refresh",
			require: contentBrowserHotkeys.REFRESH,
			callback: () => {
				ToastNotificationSystem.getInstance().success(LocalizationEN.REFRESHING)
				ContentBrowserUtil.refreshFiles().catch()
			}
		},
		GO_TO_PARENT: {
			label: "Go to parent",
			require: contentBrowserHotkeys.GO_TO_PARENT,
			callback: () => {
				if (currentDirectory.id !== FileSystemUtil.sep) {
					const found = currentDirectory.id
					if (found) {
						const split = found.split(FileSystemUtil.sep)
						split.pop()
						if (split.length === 1)
							setCurrentDirectory({id: FileSystemUtil.sep})
						else
							setCurrentDirectory({id: split.join(FileSystemUtil.sep)})
					}
				}
			}
		},
		RENAME: {
			label: "Rename",
			require: contentBrowserHotkeys.RENAME,
			callback: () => {
				setCurrentItem(SelectionStoreUtil.getContentBrowserSelected()[0])
			},
		},
		DELETE: {
			label: LocalizationEN.DELETE,
			require: contentBrowserHotkeys.DELETE,
			callback: () => {
				const s = [...SelectionStoreUtil.getContentBrowserSelected()]
				if (s.length > 0) {
					SelectionStoreUtil.setContentBrowserSelected([])
					ContentBrowserUtil.handleDelete(s, currentDirectory, setCurrentDirectory).catch()
				}
			}
		},
		CUT: {
			label: LocalizationEN.CUT,
			require: contentBrowserHotkeys.CUT,
			callback: () => ContentBrowserUtil.cutFiles([...SelectionStoreUtil.getContentBrowserSelected()])
		},
		PASTE: {
			label: LocalizationEN.PASTE,
			require: contentBrowserHotkeys.PASTE,
			callback: () => ContentBrowserUtil.paste(currentDirectory.id)
		}
	}

	return {
		hotKeys: Object.values(hotKeys),
		contextMenu: [
			{
				label: LocalizationEN.COPY_ID,
				onClick: () => {
					const ID = FSRegistryService.getByPath(SelectionStoreUtil.getContentBrowserSelected()[0])
					if (ID) {
						ToastNotificationSystem.getInstance().success(LocalizationEN.COPIED)
						ElectronResources.clipboard.writeText(ID)
					}
				}
			},
			{divider: true},
			hotKeys.SELECT_ALL,
			hotKeys.SELECT_NONE,
			hotKeys.INVERT_SELECTION,
			{divider: true},
			hotKeys.BACK,
			hotKeys.FORWARD,
			{divider: true},
			{
				label: LocalizationEN.IMPORT,
				onClick: () => EditorUtil.importFile(currentDirectory)
			},
			hotKeys.REFRESH,
			{divider: true},
			hotKeys.RENAME,
			hotKeys.CUT,
			hotKeys.PASTE,
			hotKeys.DELETE,
			{divider: true},
			{
				label: "Open current directory on explorer",
				icon: "open_in_new",
				onClick: () => ElectronResources.shell.showItemInFolder(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + currentDirectory.id))

			},
			{divider: true},

			{
				label: "Create",
				icon: "add",
				children: ContentBrowserUtil.getCreationOptions(currentDirectory)
			}
		]
	}
}