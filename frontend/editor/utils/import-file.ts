import FilesStore from "../../shared/stores/FilesStore"


import {getCall} from "../../shared/util/get-call"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../shared/LocalizationEN";
import IPCRoutes from "../../../shared/IPCRoutes";

export default async function importFile(currentDirectory) {
	const {filesImported} = await getCall<MutableObject>(IPCRoutes.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
	if (filesImported.length > 0) {
		ToastNotificationSystem.getInstance().success(LocalizationEN.IMPORT_SUCCESSFUL)
		await FilesStore.refreshFiles()
	}

}