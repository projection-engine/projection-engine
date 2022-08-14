import FilesAPI from "../../../../../libs/files/FilesAPI";
import getNewInstance from "../utils/get-new-instance";
import TextureSample from "../templates/nodes/TextureSample";
import BOARD_SIZE from "../data/BOARD_SIZE";
import CBStoreController from "../../../stores/CBStoreController";
import RegistryAPI from "../../../../../libs/files/RegistryAPI";

export default async function parseFile(file, setNodes, setLinks) {
    const res = await RegistryAPI.readRegistryFile(file.registryID)
    if (res) {
        const file = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + res.path, "json")

        if (file && Object.keys(file).length > 0) {
            const newNodes = []
            for (let i = 0; i < file.nodes.length; i++) {
                const node = file.nodes[i]
                if (!node)
                    continue

                const nodeInstance = getNewInstance(node.instance)
                if (!nodeInstance)
                    continue
                Object.keys(node).forEach(o => {
                    if (o !== "inputs" && o !== "output") {
                        if (o === "texture" && i instanceof TextureSample) i[o] = CBStoreController.data.images.find(i => i.registryID === node[o].registryID)
                        else {
                            const input = nodeInstance.inputs.find(i => i.key === o)
                            if(input && input.onChange) {
                                nodeInstance[o] = node[o]
                                input.onChange(node[o])
                            }
                            else
                                nodeInstance[o] = node[o]
                        }
                    }
                })
                nodeInstance.x = node.x + BOARD_SIZE / 2
                nodeInstance.y = node.y + BOARD_SIZE / 2
                newNodes.push(nodeInstance)
            }
            setNodes(newNodes)
            setLinks(file.links)
        } else
            setNodes([])

    } else
        setNodes([])

}