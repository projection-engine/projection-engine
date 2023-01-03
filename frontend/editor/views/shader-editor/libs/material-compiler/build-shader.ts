import materialCompiler from "./material-compiler"
import GPU from "../../../../../../engine-core/GPU";
import LOCALIZATION_EN from "../../../../../static/LOCALIZATION_EN";
import GPUAPI from "../../../../../../engine-core/lib/rendering/GPUAPI";
import AlertController from "../../../../../components/alert/AlertController";
import MutableObject from "../../../../../../engine-core/MutableObject";
import Canvas from "../Canvas";
import StaticShaders from "../../../../../../engine-core/lib/StaticShaders";
import OpenFile from "../../static/OPEN_FILE";

export default async function buildShader(canvasAPI: Canvas, openFile: OpenFile) {
    const data = await materialCompiler(canvasAPI.nodes, canvasAPI.links)
    console.trace(data)
    if (data === undefined)
        return
    const [{
        functionDeclaration,
        uniformsDeclaration,
        settings,
        uniformValues
    }, executionSignature] = data

    if (functionDeclaration) {
        const oldMaterial = GPU.materials.get(openFile.registryID)
        if (!oldMaterial) {
            AlertController.warn(LOCALIZATION_EN.NOT_APPLIED)
            return
        }

        console.trace(StaticShaders.uberSignature, executionSignature)
        if (!StaticShaders.uberSignature[executionSignature]) {
            GPUAPI.asyncDestroyMaterial(openFile.registryID)
            await GPUAPI.allocateMaterial({
                functionDeclaration,
                uniformsDeclaration,
                uniformValues,
                settings,
                executionSignature
            }, openFile.registryID)
        }else{
            AlertController.warn(LOCALIZATION_EN.UPDATING_UNIFORMS)
            await oldMaterial.updateUniformGroup(uniformValues)
        }
    } else
        console.error(LOCALIZATION_EN.ERROR_DURING_COMPILATION)
}