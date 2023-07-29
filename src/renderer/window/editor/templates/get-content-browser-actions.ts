import SELECTION_TYPES from "../views/content-browser/static/SELECTION_TYPES"
import EditorFSUtil from "../util/EditorFSUtil"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import ElectronResources from "../../shared/lib/ElectronResources"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import ContentBrowserUtil from "../util/ContentBrowserUtil"
import EditorUtil from "../util/EditorUtil"
import FileSystemUtil from "../../shared/FileSystemUtil"
import SettingsStore from "../../shared/stores/SettingsStore"
import ContentBrowserStore from "../../shared/stores/ContentBrowserStore";

export default function getContentBrowserActions(navigationHistory, getCurrentDirectory, setCurrentDirectory, setCurrentItem) {
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
			callback: () => ContentBrowserUtil.selection(SELECTION_TYPES.ALL, getCurrentDirectory())
		},
		SELECT_NONE: {
			label: "Select none",
			require: contentBrowserHotkeys.SELECT_NONE,
			callback: () => ContentBrowserUtil.selection(SELECTION_TYPES.NONE, getCurrentDirectory())
		},
		INVERT_SELECTION: {
			label: "Invert selection",

			require: contentBrowserHotkeys.INVERT_SELECTION,
			callback: () => ContentBrowserUtil.selection(SELECTION_TYPES.INVERT, getCurrentDirectory())
		},
		REFRESH: {
			label: "Refresh",
			require: contentBrowserHotkeys.REFRESH,
			callback: () => {
				ToastNotificationSystem.getInstance().success(LocalizationEN.REFRESHING)
				ContentBrowserUtil.refreshFiles().catch(console.error)
			}
		},
		GO_TO_PARENT: {
			label: "Go to parent",
			require: contentBrowserHotkeys.GO_TO_PARENT,
			callback: () => {
				if (getCurrentDirectory().id !== FileSystemUtil.sep) {
					const found = getCurrentDirectory().id
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
				setCurrentItem(ContentBrowserStore.getContentBrowserSelected()[0]?.id)
			},
		},
		DELETE: {
			label: LocalizationEN.DELETE,
			require: contentBrowserHotkeys.DELETE,
			callback: () => {
				const selectionList = ContentBrowserStore.getContentBrowserSelected().map(s => s?.id)
				if (selectionList.length > 0) {
					ContentBrowserStore.setContentBrowserSelected([])
					ContentBrowserUtil.handleDelete(selectionList, getCurrentDirectory(), setCurrentDirectory).catch(console.error)
				}
			}
		},
		CUT: {
			label: LocalizationEN.CUT,
			require: contentBrowserHotkeys.CUT,
			callback: () => ContentBrowserUtil.cutFiles([...ContentBrowserStore.getContentBrowserSelected().map(s => s?.id)])
		},
		PASTE: {
			label: LocalizationEN.PASTE,
			require: contentBrowserHotkeys.PASTE,
			callback: () => ContentBrowserUtil.paste(getCurrentDirectory().id)
		}
	}

	return {
		hotKeys: Object.values(hotKeys),
		contextMenu: [
			{
				label: LocalizationEN.COPY_ID,
				onClick: () => {
					const ID = EditorFSUtil.getByPath(ContentBrowserStore.getContentBrowserSelected()[0]?.id)
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
				onClick: () => EditorUtil.importFile(getCurrentDirectory())
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
				onClick: () => ElectronResources.shell.showItemInFolder(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + getCurrentDirectory().id))

			},
			{divider: true},

			{
				label: "Create",
				icon: "add",
				children: ContentBrowserUtil.getCreationOptions(getCurrentDirectory())
			}
		]
	}
}
