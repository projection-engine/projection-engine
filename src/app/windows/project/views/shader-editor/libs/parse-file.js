import FileSystem from "../../../libs/FileSystem";
import getNewInstance from "../utils/get-new-instance";
import TextureSample from "../templates/nodes/TextureSample";
import BOARD_SIZE from "../data/BOARD_SIZE";
import FileStoreController from "../../../stores/FileStoreController";

export default async function parseFile(file, setNodes, setLinks) {
    const res = await window.fileSystem.readRegistryFile(file.registryID)
    if (res) {
        const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + res.path, "json")

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
                        if (o === "texture" && i instanceof TextureSample) i[o] = FileStoreController.data.images.find(i => i.registryID === node[o].registryID)
                        else nodeInstance[o] = node[o]
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