import FilesStore from "../stores/FilesStore";
import {getCall} from "shared-resources/frontend/libs/NodeFS";
import ROUTES from "../static/ROUTES";

export default async function importFile(currentDirectory) {
    const {filesImported} = await getCall(ROUTES.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
    if(filesImported.length > 0) {
        alert.pushAlert("Import successful", "success")
        await FilesStore.refreshFiles()
    }

}