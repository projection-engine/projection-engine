import FilesStore from "../../shared/stores/FilesStore";
import ROUTES from "../../../backend/static/ROUTES";
import LOCALIZATION_EN from "../../shared/static/LOCALIZATION_EN";
import {getCall} from "../../shared/lib/FS/get-call";
import MutableObject from "../../../engine-core/MutableObject";
import AlertController from "../../shared/components/alert/AlertController";

export default async function importFile(currentDirectory) {
    const {filesImported} = await getCall<MutableObject>(ROUTES.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
    if(filesImported.length > 0) {
        AlertController.success(LOCALIZATION_EN.IMPORT_SUCCESSFUL)
        await FilesStore.refreshFiles()
    }

}