import FilesStore from "../../../../shared/stores/FilesStore"
import resolveFileName from "../../../utils/resolve-file-name"
import FSAssetService from "../../../services/file-system/FSAssetService"
import COMPONENT_TEMPLATE from "../../../../../engine-core/static/templates/COMPONENT_TEMPLATE"
import UI_TEMPLATE from "../../../../../engine-core/static/templates/UI_TEMPLATE"

import FileSystemUtil from "../../../../shared/lib/FileSystemUtil"
import LocalizationEN from "../../../../../shared/LocalizationEN";
import FileTypes from "../../../../../shared/FileTypes";

export default function getCreationOptions(currentDirectory) {
	async function createFile(name, type, data) {
		const path = await resolveFileName(currentDirectory.id + FileSystemUtil.sep + name, type)
		await FSAssetService.writeAsset(path, typeof data === "object" ? JSON.stringify(data) : data)
		await FilesStore.refreshFiles()
	}

	return [
		{
			label: LocalizationEN.FOLDER,
			onClick: () => FilesStore.createFolder(currentDirectory).catch()
		},
		{divider: true},
		{
			label: LocalizationEN.JSON_OBJECT,
			onClick: async () => createFile(LocalizationEN.JSON, ".json", "")
		},
		{
			label: LocalizationEN.JAVASCRIPT_PACKAGE,
			onClick: async () => createFile(LocalizationEN.JAVASCRIPT, ".js", "")
		},
		{divider: true},
		{
			label: LocalizationEN.LEVEL,
			onClick: async () => createFile(LocalizationEN.LEVEL, FileTypes.LEVEL, {entities: []})
		},
		{divider: true},
		{
			label: LocalizationEN.MATERIAL,
			onClick: async () => createFile(LocalizationEN.MATERIAL, FileTypes.MATERIAL, {})
		},

		{divider: true},
		{
			label: LocalizationEN.COMPONENT,

			onClick: async () => createFile(LocalizationEN.COMPONENT, FileTypes.COMPONENT, COMPONENT_TEMPLATE)
		},
		{
			label: LocalizationEN.UI_LAYOUT,
			onClick: async () => createFile(LocalizationEN.UI_LAYOUT, FileTypes.UI_LAYOUT, UI_TEMPLATE)
		},

	]
}