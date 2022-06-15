import refreshData from "./refreshData"
import FILE_TYPES from "../../../public/project/glTF/FILE_TYPES"
import FileSystem from "./files/FileSystem"

export default function submitPackage (pack, close, previewImage, isLevel, registryID, matInstance, isMaterial, engine) {
    if(!isLevel) {
        let p = previewImage
        if(matInstance)
            p = engine.renderer.generatePreview(matInstance)
        document.fileSystem
            .updateAsset(registryID, pack, p)
            .then(() => {

                if (matInstance)
                    engine.setMaterials(prev => prev.map(p => p.id === registryID ? matInstance : p))
                else if(!isMaterial){
                    setTimeout(() => {
                        alert.pushAlert("Reloading script", "warning",)
                        refreshData(FILE_TYPES.SCRIPT, registryID,  engine)
                    }, 1000)
                }
                alert.pushAlert(  "Saved", "success", )
            })
            .catch(() => {
                alert.pushAlert(  "Some error occurred", "error", )
            })
    }
    else
        document.fileSystem.writeFile( FileSystem.sep + "levelBlueprint" + FILE_TYPES.SCRIPT, pack)
            .then(() => {
                alert.pushAlert("success",  "Saved")

                setTimeout(() => {
                    alert.pushAlert(  "Reloading script", "warning")
                    refreshData(undefined, undefined,   engine)
                }, 1000)
            })
            .catch(() => {
                alert.pushAlert(  "Some error occurred", "error")
            })
}
