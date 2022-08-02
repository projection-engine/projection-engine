import ComponentProps from "../../../libs/engine/data/ComponentProps";
import Component from "../../../libs/engine/basic/Component";
import FileStoreController from "../../../stores/FileStoreController";
import FileSystem from "../../../libs/FileSystem"
import DataStoreController from "../../../stores/DataStoreController";

export default async function componentConstructor(entity, script) {

    const reg = await window.fileSystem.readRegistryFile(script.registryID)
    if (!reg) {
        alert.pushAlert("Error loading data")
        return
    }

    const data = await window.fileSystem.readFile(FileStoreController.ASSETS_PATH + FileSystem.sep + reg.path)
    if (!data) {
        alert.pushAlert("Error loading data")
        return
    }
    console.log(data.toString())
    let compData = new Function(data.toString())
    compData = compData(ComponentProps)
    if (!compData.COMPONENT_KEY || entity.components[compData.COMPONENT_KEY]) {
        alert.pushAlert("Error creating component")
        return
    }
    const compRef = new Component()
    compRef.constructFromCustom(
        compData.COMPONENT_NAME,
        compData.COMPONENT_ICON,
        Array.from(compData.props) ? compData.props : [],
        compData
    )

    entity.components[compData.COMPONENT_KEY] = compRef
    DataStoreController.updateEngine()
}