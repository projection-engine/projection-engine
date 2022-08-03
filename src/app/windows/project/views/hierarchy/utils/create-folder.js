import Entity from "../../../libs/engine/libs/basic/Entity";
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import FolderComponent from "../../../libs/engine/components/FolderComponent";
import DataStoreController from "../../../stores/DataStoreController";
import {ENTITY_ACTIONS} from "../../../libs/engine-extension/entityReducer";

export default function createFolder(){
    const newEntity = new Entity()
    newEntity.name = window.localization.translate("PROJECT", "HIERARCHY", "NEW_FOLDER")
    newEntity.components[COMPONENTS.FOLDER] = new FolderComponent()
    DataStoreController.engine.dispatchEntities({
        type: ENTITY_ACTIONS.ADD, payload: newEntity
    })
}
