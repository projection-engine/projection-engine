import {useContext, useEffect, useId, useRef, useState} from "react"
import Material from "../templates/nodes/Material"
import TextureSample from "../templates/nodes/TextureSample"
import getNewInstance from "../utils/getNewInstance"
import FileSystem from "../../../libs/FileSystem"
import QuickAccessProvider from "../../../context/QuickAccessProvider"
import BOARD_SIZE from "../data/BOARD_SIZE"
import BlueprintProvider from "../../../context/BlueprintProvider"
import COMPONENTS from "../../../engine/data/COMPONENTS"


export default function useShaderEditor() {
    const {
        selectedEntity,
        materials,
        setMaterials,
        quickAccessMaterials
    } = useContext(BlueprintProvider)

    const internalID = useId()
    const [openFile, setOpenFile] = useState({})
    const [nodes, setNodes] = useState([])
    const [links, setLinks] = useState([])
    const [changed, setChanged] = useState(false)
    const [impactingChange, setImpactingChange] = useState(false)
    const [selected, setSelected] = useState([])
    const [status, setStatus] = useState({})
    const {images} = useContext(QuickAccessProvider)
    const initialized = useRef(false)

    useEffect(() => {
        if (selectedEntity && selectedEntity.components[COMPONENTS.MESH] && !openFile.registryID) {
            const mID = selectedEntity.components[COMPONENTS.MESH].materialID
            const found = quickAccessMaterials.find(m => m.registryID === mID)
            if (found) {
                alert.pushAlert("Editing " + found.name, "info")
                setOpenFile(found)
            }
        }
    }, [selectedEntity])

    useEffect(() => {
        if (initialized.current) {
            setNodes([])
            setLinks([])
            setStatus({})
            setSelected([])
            setImpactingChange(false)
            setChanged(false)
        } else if (Object.values(openFile).length === 0 && quickAccessMaterials[0])
            setOpenFile(quickAccessMaterials[0])

        initialized.current = true
        parse(openFile, (d) => {
            const found = d.find(dd => dd instanceof Material)
            if (found)
                setNodes(d)
            else {
                const newMat = new Material()
                newMat.x = newMat.x + BOARD_SIZE / 2
                newMat.y = newMat.y + BOARD_SIZE / 2
                setNodes([...d, newMat])
            }
        }, setLinks, images).catch()
    }, [openFile])


    return {
        openFile, setOpenFile,
        internalID,
        selectedEntity,
        materials,
        setMaterials,
        quickAccessMaterials,

        status, setStatus,
        impactingChange,
        setImpactingChange,
        nodes,
        setNodes,
        links,
        setLinks,

        changed,
        setChanged,
        selected,
        setSelected
    }
}

async function parse(file, setNodes, setLinks, images) {
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
                        if (o === "texture" && i instanceof TextureSample) i[o] = images.find(i => i.registryID === node[o].registryID)
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