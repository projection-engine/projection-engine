import FilesAPI from "./libs/FilesAPI"
import COMPONENTS from "../../public/engine/static/COMPONENTS.json";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import FilesStore from "../stores/FilesStore";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import Loader from "./loader/Loader";
import RegistryAPI from "./libs/RegistryAPI";

import {GPU} from "../../public/engine/production";
import {PreviewSystem} from "../../public/engine/editor";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import NodeFS, {getCall} from "shared-resources/frontend/libs/NodeFS";
import ROUTES from "../data/ROUTES";

export default async function importFile(currentDirectory) {
    const {filesImported} = await getCall(ROUTES.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
    if(filesImported.length > 0) {
        alert.pushAlert("Import successful", "success")
        await FilesStore.refreshFiles()
    }
    else
        alert.pushAlert("Some error occurred")




}