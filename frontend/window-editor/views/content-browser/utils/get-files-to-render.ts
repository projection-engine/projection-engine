import FS from "../../../../shared/lib/FS/FS";
import sortItems from "./sort-items";
import {SORTS} from "../static/SORT_INFO";

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

export default function getFilesToRender(currentDirectory, fileType, itemsToMap, inputValue, elementsPerRow, sortKey, sortDirection) {
    if(!itemsToMap)
        return []

    let type = fileType?.split("")
    if (type) {
        type.shift()
        type = type.join("")
    }
    const items = sortItems(itemsToMap,  sortDirection === SORTS[1], sortKey)

    if (inputValue || fileType)
        return map(
            file => inputValue.trim() && file.name.includes(inputValue) || type && file.type === type && !file.isFolder,
            items,
            elementsPerRow
        )
    if (currentDirectory.id !== FS.sep)
        return map(
            file => file.parent === currentDirectory.id,
            items,
            elementsPerRow
        )

    return map(file => !file.parent, items, elementsPerRow)
}