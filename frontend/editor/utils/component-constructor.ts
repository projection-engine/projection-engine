import SelectionStore from "../../shared/stores/SelectionStore"
import ScriptsAPI from "../../../engine-core/lib/utils/ScriptsAPI"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../shared/LocalizationEN";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
	await ScriptsAPI.linkScript(entity, scriptID)
	if (autoUpdate)
		SelectionStore.updateStore()
	ToastNotificationSystem.getInstance().success(LocalizationEN.ADDED_COMPONENT)
}