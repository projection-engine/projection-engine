import SelectionStore from "../../shared/stores/SelectionStore"
import ScriptsAPI from "../../../engine-core/lib/utils/ScriptsAPI"
import AlertController from "../../shared/components/alert/AlertController"
import LocalizationEN from "../../../contants/LocalizationEN";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
	await ScriptsAPI.linkScript(entity, scriptID)
	if (autoUpdate)
		SelectionStore.updateStore()
	AlertController.success(LocalizationEN.ADDED_COMPONENT)
}