import materialCompiler from "../libs/material-compiler/material-compiler"
import GPU from "../../../../public/engine/GPU";
import Localization from "../../../templates/LOCALIZATION_EN";
import GPUAPI from "../../../../public/engine/lib/rendering/GPUAPI";

export default async function buildShader(nodes, links, openFile) {
    const {
        functionDeclaration,
        uniformsDeclaration,
        settings,
        uniformsData
    } = await materialCompiler(nodes.filter(n => !n.isComment), links)

    if (functionDeclaration) {
        if (!GPU.materials.get(openFile.registryID)) {
            alert.pushAlert(Localization.NOT_APPLIED, "alert")
            return
        }
        GPU.materials.delete(openFile.registryID)
        await GPUAPI.allocateMaterial({
            functionDeclaration,
            uniformsDeclaration,
            uniformsData,
            settings
        }, openFile.registryID)
    } else
        alert.pushAlert(Localization.ERROR_DURING_COMPILATION)
}