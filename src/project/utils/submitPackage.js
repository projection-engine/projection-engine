import FILE_TYPES from "../../../public/static/FILE_TYPES"
import FileSystem from "./files/FileSystem"

export default function submitPackage (pack, close, previewImage, isLevel, registryID, matInstance) {
    if(!isLevel) {
        let p = previewImage
        if(matInstance)
            p = window.renderer.generatePreview(matInstance)
        window.fileSystem
            .updateAsset(registryID, pack, p)
            .then(() => {
                alert.pushAlert(  "Saved", "success", )
            })
            .catch(() => {
                alert.pushAlert(  "Some error occurred", "error", )
            })
    }
    else
        window.fileSystem.writeFile( FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT, pack)
            .then(() => alert.pushAlert("success",  "Saved"))
            .catch(() => alert.pushAlert(  "Some error occurred", "error"))
}
