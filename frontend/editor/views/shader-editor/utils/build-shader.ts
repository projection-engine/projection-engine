import materialCompiler from "../libs/material-compiler/material-compiler"
import GPU from "../../../../../engine-core/GPU";
import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
import GPUAPI from "../../../../../engine-core/lib/rendering/GPUAPI";
import AlertController from "../../../../components/alert/AlertController";
import MutableObject from "../../../../../engine-core/MutableObject";
import ShaderLink from "../libs/ShaderLink";

export default async function buildShader(nodes: MutableObject[], links: ShaderLink[], openFile: MutableObject) {
    const DATA = await materialCompiler(nodes.filter(n => !n.isComment), links)
    if (DATA === undefined)
        return
    const {
        functionDeclaration,
        uniformsDeclaration,
        settings,
        uniformsData
    } = DATA

    if (functionDeclaration) {
        if (!GPU.materials.get(openFile.registryID)) {
            AlertController.warn(LOCALIZATION_EN.NOT_APPLIED)
            return
        }
        GPUAPI.asyncDestroyMaterial(openFile.registryID)
        await GPUAPI.allocateMaterial({
            functionDeclaration,
            uniformsDeclaration,
            uniformsData,
            settings
        }, openFile.registryID)
    } else
        console.error(LOCALIZATION_EN.ERROR_DURING_COMPILATION)
}