import FILE_TYPES from "../../../public/static/FILE_TYPES"
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

                alert.pushAlert(  "Saved", "success", )
            })
            .catch(() => {
                alert.pushAlert(  "Some error occurred", "error", )
            })
    }
    else
        document.fileSystem.writeFile( FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT, pack)
            .then(() => alert.pushAlert("success",  "Saved"))
            .catch(() => alert.pushAlert(  "Some error occurred", "error"))
}
