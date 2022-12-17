import FilesStore from "../stores/FilesStore";
import {getCall} from "frontend/shared/libs/NodeFS";
import ROUTES from "../../../backend/static/ROUTES.ts";
import LOCALIZATION_EN from "../templates/LOCALIZATION_EN";
import ConsoleAPI from "../../../engine-core/lib/utils/ConsoleAPI";

export default async function importFile(currentDirectory) {
    const {filesImported} = await getCall(ROUTES.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
    if(filesImported.length > 0) {
        ConsoleAPI.log(LOCALIZATION_EN.IMPORT_SUCCESSFUL)
        await FilesStore.refreshFiles()
    }

}