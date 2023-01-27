import materialCompiler from "./material-compiler/material-compiler";
import AssetAPI from "../../../lib/fs/AssetAPI";
import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
import FilesStore from "../../../stores/FilesStore";
import AlertController from "../../../../../components/alert/AlertController";
import Canvas from "./Canvas";
import type ShaderNode from "../templates/ShaderNode";
import GPU from "../../../../../../engine-core/GPU";
import UberShader from "../../../../../../engine-core/utils/UberShader";
import GPUAPI from "../../../../../../engine-core/lib/rendering/GPUAPI";
import NodesIndex from "../static/NODE_MAP";
import ShaderLink from "../templates/ShaderLink";
import ShaderComment from "../templates/ShaderComment";

export default class ShaderEditorTools {

    static GRID_SIZE = 20
    static scale = 1
    static grid = ShaderEditorTools.GRID_SIZE
    static copied = new Map()
    static toOpenFile

    static parseNode(node) {
        if (!node)
            return
        const nodeInstance = NodesIndex[node.instance] ? new NodesIndex[node.instance]() : undefined
        if (!nodeInstance)
            return;
        Object.keys(node).forEach(o => {
            if (o === "texture" && nodeInstance instanceof NodesIndex.TextureSample) nodeInstance[o] = FilesStore.data.textures.find(i => i.registryID === node[o].registryID)
            else {
                const input = nodeInstance.inputs.find(i => i.key === o)
                if (!input && !nodeInstance.output.find(i => i.key === o))
                    return
                if (input && input.onChange) {
                    nodeInstance[o] = node[o]
                    input.onChange(node[o])
                } else
                    nodeInstance[o] = node[o]
            }
        })

        nodeInstance.x = node.x
        nodeInstance.name = node.name
        nodeInstance.id = node.id
        nodeInstance.y = node.y
        nodeInstance.width = Math.max(node.width, nodeInstance.minWidth)
        nodeInstance.height = Math.max(node.height, nodeInstance.minHeight)
        return nodeInstance
    }

    static copy(nodes) {
        ShaderEditorTools.copied.clear()
        for (let i = 0; i < nodes.length; i++)
            if (nodes[i])
                ShaderEditorTools.copied.set(nodes[i].id, ShaderEditorTools.serializeNode(nodes[i]))
    }

    static paste(canvasAPI: Canvas) {
        ShaderEditorTools.copied.forEach(d => {
            canvasAPI.addNode(ShaderEditorTools.parseNode({...d, id: crypto.randomUUID()}))
        })
        canvasAPI.clear()
    }

    static serializeNode(n: ShaderNode) {
        return {
            ...n,
            instance: n.getSignature(),
            texture: n.texture && typeof n.texture === "object" ? {registryID: n.texture.registryID} : undefined
        }
    }

    static serializeLink(l: ShaderLink) {
        return {
            sourceNode: l.sourceNode.id,
            targetNode: l.targetNode.id,
            sourceRef: l.sourceRef.key,
            targetRef: l.targetRef.key,
        }
    }

    static serializeComment(c: ShaderComment) {
        return {...c}
    }
    
    static async save(canvasAPI: Canvas) {
        const openFile = canvasAPI.openFile
        try {
            const compiled = await materialCompiler(canvasAPI.nodes, canvasAPI.links)
            const materialData = {
                nodes: canvasAPI.nodes.map(ShaderEditorTools.serializeNode),
                links: canvasAPI.links.map(ShaderEditorTools.serializeLink),
                comments: canvasAPI.comments.map(ShaderEditorTools.serializeComment),
                response: compiled[0]
            }
            await AssetAPI.updateAsset(openFile.registryID, JSON.stringify(materialData))

            const oldMaterial = GPU.materials.get(openFile.registryID)
            if (oldMaterial) {
                if (!UberShader.uberSignature[compiled[1]]) {
                    GPUAPI.asyncDestroyMaterial(openFile.registryID)
                    await GPUAPI.allocateMaterial({
                        functionDeclaration: compiled[0].functionDeclaration,
                        uniformsDeclaration: compiled[0].uniformsDeclaration,
                        uniformValues: compiled[0].uniformValues,
                        settings: compiled[0].settings,
                        executionSignature: compiled[1]
                    }, openFile.registryID)
                } else {
                    AlertController.warn(LOCALIZATION_EN.UPDATING_UNIFORMS)
                    await oldMaterial.updateUniformGroup(compiled[0].uniformValues)

                    oldMaterial.doubleSided = compiled[0].settings.doubleSided
                    oldMaterial.ssrEnabled = compiled[0].settings.ssrEnabled
                    oldMaterial.renderingMode = compiled[0].settings.renderingMode
                }
            }

            AlertController.success(LOCALIZATION_EN.SAVED)
        } catch (err) {
            console.error(err)
        }
    }
}