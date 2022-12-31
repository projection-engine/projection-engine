import FilesAPI from "../../../lib/fs/FilesAPI";
import RegistryAPI from "../../../lib/fs/RegistryAPI";
import ShaderEditorTools from "../libs/ShaderEditorTools";
import ShaderLink from "../templates/ShaderLink";
import NodeFS from "../../../../lib/FS/NodeFS";
import Canvas from "../libs/Canvas";
import OpenFile from "../static/OPEN_FILE";
import Comment from "../templates/Comment";
import ShaderNode from "../templates/ShaderNode";

export default async function parseFile(openFile: OpenFile, canvasAPI: Canvas) {
    const res = RegistryAPI.getRegistryEntry(openFile.registryID)
    canvasAPI.nodes.length = 0

    if (!res)
        return
    let dataToParse = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + res.path, "json")
    if (dataToParse && Object.keys(dataToParse).length > 0) {

        for (let i = 0; i < dataToParse.nodes.length; i++) {
            const node = dataToParse.nodes[i]
            const parsed = ShaderEditorTools.parseNode(node)
            if (!parsed)
                continue
            canvasAPI.nodes.push(parsed)
        }
        for (let i = 0; i < dataToParse.comments.length; i++) {
            const node = dataToParse.comments[i]

            const parsed = new Comment(node.x, node.y)
            parsed.color = node.color
            parsed.name = node.name
            parsed.width = node.width
            parsed.height = node.height
            canvasAPI.comments.push(parsed)
        }
        for (let i = 0; i < dataToParse.links.length; i++) {
            const current = dataToParse.links[i]
            let sourceNode: ShaderNode, targetNode: ShaderNode
            for (let j = 0; j < canvasAPI.nodes.length; j++) {
                const n = canvasAPI.nodes[j]
                if (n.id === current.sourceNode.id)
                    sourceNode = n
                if (n.id === current.targetNode.id)
                    targetNode = n
                if (targetNode && sourceNode)
                    break
            }
            if (!targetNode || !sourceNode)
                continue
            const targetRef = targetNode.inputs.find(i => i.key === current.targetRef.key)
            const sourceRef = sourceNode.output.find(i => i.key === current.sourceRef.key)
            const link = new ShaderLink(targetNode, sourceNode, targetRef, sourceRef)

            canvasAPI.links.push(link)
        }
    }
}