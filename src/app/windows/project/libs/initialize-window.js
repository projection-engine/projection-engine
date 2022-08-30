import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import FilesAPI from "../../../libs/files/FilesAPI";
import BOARD_SIZE from "../views/shader-editor/data/BOARD_SIZE";
import compiler from "../views/shader-editor/libs/compiler";
import AssetAPI from "../../../libs/files/AssetAPI";
import ErrorLoggerAPI from "../../../libs/files/ErrorLoggerAPI";


export default function InitializeWindow() {
    ErrorLoggerAPI.initialize()
    FilesAPI.initializeFolders()
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat

    window.contextMenu = {targets: {}, focused: undefined}
    window.shaderEditor = {
        scale: 1,
        grid: 1,
        async compile(nodes, links) {
            const parsedNodes = nodes.map(n => {
                const docNode = document.getElementById(n.id).parentNode
                const transformation = docNode
                    .getAttribute("transform")
                    .replace("translate(", "")
                    .replace(")", "")
                    .split(" ")

                const bBox = docNode.getBoundingClientRect()
                return {
                    ...n,
                    x: parseFloat(transformation[0]) - BOARD_SIZE / 2,
                    y: parseFloat(transformation[1]) - BOARD_SIZE / 2,
                    width: bBox.width,
                    height: bBox.height,
                    instance: n.constructor.name,
                    texture: n.texture && typeof n.texture === "object" ? {registryID: n.texture.registryID} : undefined
                }
            })
            const compiled = await compiler(nodes.filter(n => !n.isComment), links)
            const preview = window.renderer.generatePreview(true)

            return {
                compiled, preview, parsedNodes
            }
        },
        async save(openFile, nodes, links, translate) {
            const {
                compiled, preview, parsedNodes
            } = await this.compile(nodes, links)
            AssetAPI.updateAsset(
                openFile.registryID,
                JSON.stringify({
                    nodes: parsedNodes,
                    links: links,
                    response: compiled,
                    type: compiled.variant
                }),
                preview
            )
                .then(() => alert.pushAlert(translate("SAVED"), "success",))
                .catch(() => alert.pushAlert(translate("ERROR"), "error"))
        }
    }

}