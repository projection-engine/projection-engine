import {ALL_NODES} from "../static/ALL_NODES";

export default function handleDropBoard(data) {
    const find = (current) => {
        let n = current.find(el => el.dataTransfer === data)
        if (n)
            n = n.getNewInstance()
        return n
    }

    return find(ALL_NODES)
}