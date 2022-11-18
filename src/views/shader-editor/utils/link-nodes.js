import DATA_TYPES from "../../../../public/engine/static/DATA_TYPES";
import handleLink from "./handle-link";
import ShaderEditorTools from "../libs/ShaderEditorTools";

export default function linkNodes(inputData, node) {
    const data = ShaderEditorTools.connectionOnDrag
    console.log(node)
    if (inputData.accept.includes(data.type) || inputData.accept.includes(DATA_TYPES.ANY))
        handleLink({attribute: data, id: data.nodeID}, {attribute: inputData, id: node.id}, node.CONTEXT_ID)
    else
        alert.pushAlert(
            "Invalid type",
            "error"
        )
}