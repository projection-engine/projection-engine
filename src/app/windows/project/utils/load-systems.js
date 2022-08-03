import FileSystem from "../libs/FileSystem";
import DataStoreController from "../stores/DataStoreController";
import FileStoreController from "../stores/FileStoreController";
import Scripting from "../libs/engine/libs/passes/misc/Scripting";

const {shell} = window.require("electron")

export default async function loadSystems(engine) {
    const newValue = !engine.executingAnimation
    const scripts = []
    try {
        if (newValue) {
            const systems = FileStoreController.data.systems
            for (let i = 0; i < systems.length; i++) {
                const current = systems[i]
                const reg = await window.fileSystem.readRegistryFile(current.registryID)
                if (!reg)
                    continue
                const file = await window.fileSystem.readFile(FileStoreController.ASSETS_PATH + FileSystem.sep + reg.path)
                if (!file)
                    continue
                try{
                    scripts.push(Scripting.parseScript(file.toString()))
                }catch (err){
                    console.error(err)
                    alert.pushAlert("Error parsing system")
                    shell.openPath(FileStoreController.ASSETS_PATH + FileSystem.sep + reg.path).catch()
                }

            }
        }
        DataStoreController.updateEngine({...engine, executingAnimation: newValue, scripts})
    } catch (err) {
        console.error(err)
        if (newValue)
            alert.pushAlert("Some error occurred", "error")
    }
}