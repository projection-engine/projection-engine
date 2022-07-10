export default function submitPackage(registryID, pack) {
    const p = window.renderer.generatePreview(true)
    window.fileSystem
        .updateAsset(registryID, pack, p)
        .then(() => {
            alert.pushAlert("Saved", "success",)
        })
        .catch(() => {
            alert.pushAlert("Some error occurred", "error",)
        })
}
