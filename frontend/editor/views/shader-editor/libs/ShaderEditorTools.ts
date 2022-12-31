import materialCompiler from "./material-compiler/material-compiler";
import AssetAPI from "../../../lib/fs/AssetAPI";
import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
import getNewInstance from "../utils/get-new-instance";
import TextureSample from "../templates/nodes/TextureSample";
import FilesStore from "../../../stores/FilesStore";
import {v4} from "uuid";
import AlertController from "../../../../components/alert/AlertController";
import OpenFile from "../static/OPEN_FILE";
import Canvas from "./Canvas";
import ShaderNode from "../templates/ShaderNode";

export default class ShaderEditorTools {

    static GRID_SIZE = 20
    static scale = 1
    static grid = ShaderEditorTools.GRID_SIZE
    static copied = new Map()
    static connectionOnDrag
    static toOpenFile

    static parseNode(node):ShaderNode {
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
        // nodeInstance.x = node.x + BOARD_SIZE / 2
        // nodeInstance.y = node.y + BOARD_SIZE / 2
        return nodeInstance
    }

    static copy(nodes) {
        ShaderEditorTools.copied.clear()
        for (let i = 0; i < nodes.length; i++)
            if (nodes[i])
                ShaderEditorTools.copied.set(nodes[i].id, ShaderEditorTools.#serializeNode(nodes[i]))
    }

    static paste(canvasAPI: Canvas) {
        ShaderEditorTools.copied.forEach(d => {
            canvasAPI.nodes.push(ShaderEditorTools.parseNode({...d, id: v4()}))
        })
        canvasAPI.clear()
    }

    static #serializeNode(n: ShaderNode) {
        return {
            ...n,
            instance: n.constructor.name,
            texture: n.texture && typeof n.texture === "object" ? {registryID: n.texture.registryID} : undefined
        }
    }

    static async compile(canvasAPI: Canvas) {
        const serializedNodes = canvasAPI.nodes.map(ShaderEditorTools.#serializeNode)
        const compiled = await materialCompiler(canvasAPI.nodes, canvasAPI.links)
        return {compiled, serializedNodes}
    }

    static async save(openFile: OpenFile, canvasAPI: Canvas) {
        try {
            const {compiled, serializedNodes} = await ShaderEditorTools.compile(canvasAPI)
            const materialData = {
                nodes: serializedNodes,
                links: canvasAPI.links,
                response: compiled,
                type: compiled.variant
            }
            await AssetAPI.updateAsset(
                openFile.registryID,
                JSON.stringify(materialData)
            )
            AlertController.success(LOCALIZATION_EN.SAVED)
        } catch (err) {
            console.error(err)
        }
    }
}