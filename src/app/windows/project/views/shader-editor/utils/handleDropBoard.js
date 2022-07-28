export default function handleDropBoard(data, allNodes) {
    const find = (current) => {
        let n = current.find(el => el.dataTransfer === data)
        if (n)
            n = n.getNewInstance()
        return n
    }

    return find(allNodes)
}