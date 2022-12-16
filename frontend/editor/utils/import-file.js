import FilesStore from "../stores/FilesStore";
import {getCall} from "shared-resources/frontend/libs/NodeFS";
import ROUTES from "../../../backend/static/ROUTES.json";
import LOCALIZATION_EN from "../templates/LOCALIZATION_EN";

export default async function importFile(currentDirectory) {
    const {filesImported} = await getCall(ROUTES.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
    if(filesImported.length > 0) {
        window.consoleAPI.log(LOCALIZATION_EN.IMPORT_SUCCESSFUL)
        await FilesStore.refreshFiles()
    }

}