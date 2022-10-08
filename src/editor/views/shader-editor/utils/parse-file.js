import FilesAPI from "../../../../shared/libs/FilesAPI";
import RegistryAPI from "../../../../shared/libs/RegistryAPI";
import ShaderEditorController from "../ShaderEditorController";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

export default async function parseFile(file, setNodes, setLinks) {
    const res = await RegistryAPI.readRegistryFile(file.registryID)
    if (res) {
        const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + res.path, "json")

        if (file && Object.keys(file).length > 0) {
            const newNodes = []
            for (let i = 0; i < file.nodes.length; i++) {
                const node = file.nodes[i]
                newNodes.push(ShaderEditorController.parseNode(node))
            }
            setNodes(newNodes)
            setLinks(file.links)
        } else
            setNodes([])

    } else
        setNodes([])

}