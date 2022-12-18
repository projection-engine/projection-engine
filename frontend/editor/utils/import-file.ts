import FilesStore from "../stores/FilesStore";
import ROUTES from "../../../backend/static/ROUTES";
import LOCALIZATION_EN from "../templates/LOCALIZATION_EN";
import ConsoleAPI from "../../../engine-core/lib/utils/ConsoleAPI";
import {getCall} from "../../shared/libs/get-call";
import MutableObject from "../../../engine-core/MutableObject";

export default async function importFile(currentDirectory) {
    const {filesImported} = await getCall<MutableObject>(ROUTES.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
    if(filesImported.length > 0) {
        console.log(LOCALIZATION_EN.IMPORT_SUCCESSFUL)
        await FilesStore.refreshFiles()
    }

}