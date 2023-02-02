import SelectionStore from "../stores/SelectionStore";
import ScriptsAPI from "../../../engine-core/lib/utils/ScriptsAPI";
import AlertController from "../../shared/components/alert/AlertController";
import LOCALIZATION_EN from "../../shared/static/LOCALIZATION_EN";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    await ScriptsAPI.linkScript(entity, scriptID)
    if (autoUpdate)
        SelectionStore.updateStore()
    AlertController.success(LOCALIZATION_EN.ADDED_COMPONENT)
}