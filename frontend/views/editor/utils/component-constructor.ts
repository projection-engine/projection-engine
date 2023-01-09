import SelectionStore from "../stores/SelectionStore";
import ScriptsAPI from "../../../../engine-core/lib/utils/ScriptsAPI";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    await ScriptsAPI.linkScript(entity, scriptID)
    if (autoUpdate)
        SelectionStore.updateStore()
}