import SelectionStore from "../stores/SelectionStore";
import ScriptsAPI from "../../public/engine/lib/rendering/ScriptsAPI";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    await ScriptsAPI.linkScript(entity, scriptID)
    if (autoUpdate)
        SelectionStore.updateStore()
}