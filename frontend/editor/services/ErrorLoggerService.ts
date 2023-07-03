import FileSystemUtil from "../../shared/FileSystemUtil"
import ConsoleAPI from "../../../engine-core/lib/utils/ConsoleAPI"
import Folders from "../../../shared/Folders"
import StorageKeys from "../../../shared/StorageKeys"

export default class ErrorLoggerService {

	static get path() {
		return sessionStorage.getItem(StorageKeys.PROJECT_PATH) + FileSystemUtil.sep + Folders.ERROR_FILE
	}

	static async save() {
		const p = ErrorLoggerService.path
		await FileSystemUtil.writeFile(p, JSON.stringify(ConsoleAPI.getErrorMessages()), true)
	}
}