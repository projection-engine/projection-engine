import FilesAPI from "../../../../../libs/files/FilesAPI";
import getNewInstance from "../utils/get-new-instance";
import TextureSample from "../templates/nodes/TextureSample";
import BOARD_SIZE from "../data/BOARD_SIZE";
import FilesStore from "../../../stores/FilesStore";
import RegistryAPI from "../../../../../libs/files/RegistryAPI";
import ShaderEditorController from "../ShaderEditorController";

export default async function parseFile(file, setNodes, setLinks) {
    const res = await RegistryAPI.readRegistryFile(file.registryID)
    if (res) {
        const file = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + res.path, "json")

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