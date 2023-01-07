import materialCompiler from "./material-compiler/material-compiler";
import AssetAPI from "../../../lib/fs/AssetAPI";
import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
import getNewInstance from "../utils/get-new-instance";
import TextureSample from "../templates/nodes/TextureSample";
import FilesStore from "../../../stores/FilesStore";

import AlertController from "../../../../../components/alert/AlertController";
import Canvas from "./Canvas";
import type ShaderNode from "../templates/ShaderNode";

export default class ShaderEditorTools {

    static GRID_SIZE = 20
    static scale = 1
    static grid = ShaderEditorTools.GRID_SIZE
    static copied = new Map()
    static toOpenFile

    static parseNode(node): ShaderNode | undefined {
        if (!node)
            return
        const nodeInstance = <ShaderNode | null>getNewInstance(node.instance)
        if (nodeInstance === null)
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
            canvasAPI.nodes.push(ShaderEditorTools.parseNode({...d, id: crypto.randomUUID()}))
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
        const [compiled] = await materialCompiler(canvasAPI.nodes, canvasAPI.links)
        return {compiled, serializedNodes}
    }

    static async save(canvasAPI: Canvas) {
        const openFile = canvasAPI.openFile
        try {
            const {compiled, serializedNodes} = await ShaderEditorTools.compile(canvasAPI)
            const materialData = {
                nodes: serializedNodes,
                links: canvasAPI.links.map(l => ({
                    sourceNode: l.sourceNode.id,
                    targetNode: l.targetNode.id,
                    sourceRef: l.sourceRef.key,
                    targetRef: l.targetRef.key,
                })),
                response: compiled,
                comments: canvasAPI.comments
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