import BOARD_SIZE from "./data/BOARD_SIZE";
import materialCompiler from "../../../public/engine/editor/libs/material-compiler/material-compiler";
import Material from "../../../public/engine/lib/instances/Material";
import PreviewSystem from "../../../public/engine/editor/services/PreviewSystem";
import AssetAPI from "../../libs/AssetAPI";
import Localization from "../../templates/Localization";
import getNewInstance from "./utils/get-new-instance";
import TextureSample from "./templates/nodes/TextureSample";
import FilesStore from "../../stores/FilesStore";
import {v4} from "uuid";
import GPUResources from "../../../public/engine/GPUResources";

export default class ShaderEditorController {
    static GRID_SIZE = 20
    static scale = 1
    static grid = ShaderEditorController.GRID_SIZE
    static copied = new Map()
    static connectionOnDrag

    static parseNode(node) {
        if (!node)
            return
        const nodeInstance = getNewInstance(node.instance)
        if (!nodeInstance)
            return;
        Object.keys(node).forEach(o => {
            if (o !== "inputs" && o !== "output") {
                if (o === "texture" && nodeInstance instanceof TextureSample) nodeInstance[o] = FilesStore.data.textures.find(i => i.registryID === node[o].registryID)
                else {
                    const input = nodeInstance.inputs.find(i => i.key === o)
                    if (input && input.onChange) {
                        nodeInstance[o] = node[o]
                        input.onChange(node[o])
                    } else
                        nodeInstance[o] = node[o]
                }
            }
        })
        nodeInstance.x = node.x + BOARD_SIZE / 2
        nodeInstance.y = node.y + BOARD_SIZE / 2
        return nodeInstance
    }

    static copy(nodes) {
        ShaderEditorController.copied.clear()
        for (let i = 0; i < nodes.length; i++)
            ShaderEditorController.copied.set(nodes[i].id, ShaderEditorController.#serializeNode(nodes[i]))
    }

    static paste(updateNodes) {
        const newNodes = []
        ShaderEditorController.copied.forEach(d => {
            newNodes.push(ShaderEditorController.parseNode({...d, id: v4()}))
        })
        updateNodes(newNodes)
    }

    static #serializeNode(n) {
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
    }

    static async compile(nodes, links, isSave, id) {
        const parsedNodes = nodes.map(ShaderEditorController.#serializeNode)
        const compiled = await materialCompiler(nodes.filter(n => !n.isComment), links)

        let preview
        if (isSave) {
            let material
            if (GPUResources.materials.get(id)) {
                material = GPUResources.materials.get(id)
                await new Promise(resolve => material.shader = [compiled.shader, compiled.vertexShader, compiled.uniformData, () => resolve()])
            } else
                await new Promise(resolve => {
                    material = new Material({
                        vertex: compiled.vertexShader,
                        fragment: compiled.shader,
                        onCompiled: () => resolve(),
                        settings: compiled.settings
                    })
                })
            preview = PreviewSystem.execute(material)
        }

        return {compiled, preview, parsedNodes}
    }

    static async save(openFile, nodes, links) {

        const {compiled, preview, parsedNodes} = await ShaderEditorController.compile(nodes, links, true)

        AssetAPI.updateAsset(
            openFile?.registryID,
            JSON.stringify({
                nodes: parsedNodes,
                links: links,
                response: compiled,
                type: compiled.variant
            }),
            preview
        ).then(() => alert.pushAlert(Localization.SAVED, "success",))
            .catch(() => alert.pushAlert(Localization.ERROR, "error"))
    }
}