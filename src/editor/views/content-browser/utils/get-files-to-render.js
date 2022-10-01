import FilesAPI from "../../../../shared/libs/FilesAPI";

function map(check, items, elementsPerRow) {
    let newArr = []
    let offset = 0
    for (let i = 0; i < items.length; i++) {

        const current = items[i]
        if (!check(current))
            continue
        if (!newArr[offset])
            newArr[offset] = []

        current.children = current.isFolder ? items.filter(i => typeof i.parent === "string" && i.parent === current.id).length : 0
        newArr[offset].push(current)
        if (newArr[offset].length >= elementsPerRow)
            offset += 1
    }
    return newArr
}

export default function getFilesToRender(currentDirectory, fileType, items, searchString, elementsPerRow) {
    let type = fileType?.split("")
    if (type) {
        type.shift()
        type = type.join("")
    }
    if (searchString || fileType)
        return map(
            file => searchString.trim() && file.name.includes(searchString) || type && file.type === type && !file.isFolder,
            items,
            elementsPerRow
        )
    if (currentDirectory.id !== FilesAPI.sep)
        return map(
            file => file.parent === currentDirectory.id,
            items,
            elementsPerRow
        )

    return map(file => !file.parent, items, elementsPerRow)
}