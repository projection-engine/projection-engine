import {allNodes} from "../templates/all-nodes";

export default function handleDropBoard(data) {
    const find = (current) => {
        let n = current.find(el => el.dataTransfer === data)
        if (n)
            n = n.getNewInstance()
        return n
    }

    return find(allNodes)
}