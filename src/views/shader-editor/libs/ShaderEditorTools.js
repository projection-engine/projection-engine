import BOARD_SIZE from "../static/BOARD_SIZE";
import materialCompiler from "./material-compiler/material-compiler";
import Material from "../../../../public/engine/instances/Material";
import AssetAPI from "../../../lib/fs/AssetAPI";
import Localization from "../../../templates/LOCALIZATION_EN";
import getNewInstance from "../utils/get-new-instance";
import TextureSample from "./nodes/TextureSample";
import FilesStore from "../../../stores/FilesStore";
import {v4} from "uuid";
import GPU from "../../../../public/engine/GPU";
import RegistryAPI from "../../../lib/fs/RegistryAPI";
import FILE_TYPES from "shared-resources/FILE_TYPES";

export default class ShaderEditorTools {

    static GRID_SIZE = 20
    static scale = 1
    static grid = ShaderEditorTools.GRID_SIZE
    static copied = new Map()
    static connectionOnDrag
    static toOpenFile

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
        ShaderEditorTools.copied.clear()
        for (let i = 0; i < nodes.length; i++)
            ShaderEditorTools.copied.set(nodes[i].id, ShaderEditorTools.#serializeNode(nodes[i]))
    }

    static paste(updateNodes) {
        const newNodes = []
        ShaderEditorTools.copied.forEach(d => {
            newNodes.push(ShaderEditorTools.parseNode({...d, id: v4()}))
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
        const parsedNodes = nodes.map(ShaderEditorTools.#serializeNode)
        const compiled = await materialCompiler(nodes.filter(n => !n.isComment), links)


        if (isSave) {
            let material
            if (GPU.materials.get(id)) {
                material = GPU.materials.get(id)
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
        }

        return {compiled, parsedNodes}
    }

    static async save(openFile, nodes, links) {
        try {
            const reg = RegistryAPI.getRegistryEntry(openFile.registryID)
            const isLevel = reg.path.includes(FILE_TYPES.LEVEL)
            const {compiled, parsedNodes} = await ShaderEditorTools.compile(nodes, links, true)
            const materialData = {
                nodes: parsedNodes,
                links,
                response: compiled,
                type: compiled.variant
            }
            if (isLevel) {

            } else
                await AssetAPI.updateAsset(
                    openFile.registryID,
                    JSON.stringify(materialData)
                )
            alert.pushAlert(Localization.SAVED, "success")
        } catch (err) {
            console.error(err)
        }
    }
}