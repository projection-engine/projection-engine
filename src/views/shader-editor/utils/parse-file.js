import FilesAPI from "../../../lib/fs/FilesAPI";
import RegistryAPI from "../../../lib/fs/RegistryAPI";
import ShaderEditorTools from "../libs/ShaderEditorTools";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import ShaderLink from "../libs/ShaderLink";
import FILE_TYPES from "shared-resources/FILE_TYPES";

export default async function parseFile(openFile, setNodes, setLinks) {
    const res = RegistryAPI.getRegistryEntry(openFile.registryID)
    let isLevel = false
    if (res) {
        isLevel = res.path.includes(FILE_TYPES.LEVEL)
        let dataToParse = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + res.path, "json")
        if(isLevel)
            dataToParse = dataToParse.worldMaterial

        if (dataToParse && Object.keys(dataToParse).length > 0) {
            const newNodes = []
            for (let i = 0; i < dataToParse.nodes.length; i++) {
                const node = dataToParse.nodes[i]

                const parsed = ShaderEditorTools.parseNode(node)
                parsed.CONTEXT_ID = openFile.registryID
                newNodes.push(parsed)
            }
            setNodes(newNodes)
            setLinks(dataToParse.links.map(l => l.targetRef?.id && l.sourceRef?.id && new ShaderLink(l.targetRef, l.sourceRef, openFile.registryID)).filter(e => e))
        } else
            setNodes([])

    } else
        setNodes([])

}