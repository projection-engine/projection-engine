import FilesAPI from "../../../lib/fs/FilesAPI";
import RegistryAPI from "../../../lib/fs/RegistryAPI";
import ShaderEditorTools from "../libs/ShaderEditorTools";
import ShaderLink from "../templates/ShaderLink";
import FS from "../../../../../lib/FS/FS";
import Canvas from "../libs/Canvas";
import OpenFile from "../static/OPEN_FILE";
import Comment from "../templates/Comment";

export default async function parseFile(openFile: OpenFile, canvasAPI: Canvas) {
    const res = RegistryAPI.getRegistryEntry(openFile.registryID)
    canvasAPI.nodes.length = 0

    if (!res)
        return
    let dataToParse = await FilesAPI.readFile(FS.ASSETS_PATH + FS.sep + res.path, "json")
    if (dataToParse && Object.keys(dataToParse).length > 0) {

        if (dataToParse.nodes)
            for (let i = 0; i < dataToParse.nodes.length; i++) {
                const node = dataToParse.nodes[i]
                const parsed = ShaderEditorTools.parseNode(node)
                if (!parsed)
                    continue
                canvasAPI.nodes.push(parsed)
            }
        if (dataToParse.comments)
            for (let i = 0; i < dataToParse.comments.length; i++) {
                const node = dataToParse.comments[i]

                const parsed = new Comment(node.x, node.y)
                parsed.color = node.color
                parsed.name = node.name
                parsed.width = node.width
                parsed.height = node.height
                canvasAPI.comments.push(parsed)
            }
        if (dataToParse.links)
            for (let i = 0; i < dataToParse.links.length; i++) {
                try {
                    const current = dataToParse.links[i]
                    let sourceNode, targetNode
                    for (let j = 0; j < canvasAPI.nodes.length; j++) {
                        const n = canvasAPI.nodes[j]
                        if (n.id === current.sourceNode)
                            sourceNode = n
                        if (n.id === current.targetNode)
                            targetNode = n
                        if (targetNode && sourceNode)
                            break
                    }
                    if (!targetNode || !sourceNode)
                        continue
                    const targetRef = targetNode.inputs.find(i => i.key === current.targetRef)
                    const sourceRef = sourceNode.output.find(i => i.key === current.sourceRef)
                    const link = new ShaderLink(targetNode, sourceNode, targetRef, sourceRef)

                    canvasAPI.links.push(link)
                } catch (err) {
                    console.warn(err)
                }
            }
    }
}