import FilesStore from "../stores/FilesStore";
import ROUTES from "../../../../backend/static/ROUTES";
import LOCALIZATION_EN from "../static/LOCALIZATION_EN";
import {getCall} from "../../../lib/FS/get-call";
import MutableObject from "../../../../engine-core/MutableObject";
import AlertController from "../../../components/alert/AlertController";

export default async function importFile(currentDirectory) {
    const {filesImported} = await getCall<MutableObject>(ROUTES.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
    if(filesImported.length > 0) {
        AlertController.success(LOCALIZATION_EN.IMPORT_SUCCESSFUL)
        await FilesStore.refreshFiles()
    }

}