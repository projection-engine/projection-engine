import {ALL_NODES} from "../static/ALL_NODES";
import type ShaderNode from "../templates/ShaderNode";

export default function handleDropBoard(data):ShaderNode|undefined {
    const found = ALL_NODES.find(el => el.dataTransfer === data)
    return found?.getNewInstance()
}