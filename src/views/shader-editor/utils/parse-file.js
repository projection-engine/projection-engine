import FilesAPI from "../../../lib/fs/FilesAPI";
import RegistryAPI from "../../../lib/fs/RegistryAPI";
import ShaderEditorTools from "../ShaderEditorTools";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

export default async function parseFile(file, setNodes, setLinks) {
    const res = RegistryAPI.getRegistryEntry(file.registryID)
    if (res) {
        const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + res.path, "json")

        if (file && Object.keys(file).length > 0) {
            const newNodes = []
            for (let i = 0; i < file.nodes.length; i++) {
                const node = file.nodes[i]
                node.CONTEXT_ID = file.registryID
                newNodes.push(ShaderEditorTools.parseNode(node))
            }
            setNodes(newNodes)

            setLinks(file.links.map(l => ({...l, CONTEXT_ID: file.registryID})))
        } else
            setNodes([])

    } else
        setNodes([])

}