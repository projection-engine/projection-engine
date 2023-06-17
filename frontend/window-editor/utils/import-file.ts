import FilesStore from "../../shared/stores/FilesStore"


import {getCall} from "../../shared/lib/FS/get-call"
import AlertController from "../../shared/components/alert/AlertController"
import LocalizationEN from "../../../contants/LocalizationEN";
import IPCRoutes from "../../../contants/IPCRoutes";

export default async function importFile(currentDirectory) {
	const {filesImported} = await getCall<MutableObject>(IPCRoutes.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
	if (filesImported.length > 0) {
		AlertController.success(LocalizationEN.IMPORT_SUCCESSFUL)
		await FilesStore.refreshFiles()
	}

}