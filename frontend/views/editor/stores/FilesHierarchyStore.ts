import {get, writable} from "svelte/store";
import FilesStore from "./FilesStore";
import FS from "../../../lib/FS/FS";
import MutableObject from "../../../../engine-core/MutableObject";

const store = writable({items: [], open: {}});

export default class FilesHierarchyStore {
    static data = get(store)

    static getStore(onChange) {
        return store.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value = FilesHierarchyStore.data) {
        if(value.open !== FilesHierarchyStore.data.open){
            FilesHierarchyStore.update()
            return
        }

        FilesHierarchyStore.data = value
        store.set(value)
    }

    static update(items=FilesStore.data.items) {
        if(!items)
            return
        const open = FilesHierarchyStore.data.open
        const folders = items.filter(item => item.isFolder)
        const cache:MutableObject = {
            [FS.sep]: {
                depth: 0,
                item: {id: FS.sep, name: "Assets", isFolder: true},
                childQuantity: folders.length
            }
        }

        function getHierarchy( item, depth = 0, folders) {
            cache[item.id] = <MutableObject>{item, depth, childQuantity: 0, children: []}
            const isOpen = open[item.id]
            for (let i = 0; i < folders.length; i++) {
                const current = folders[i]
                if (current.parent === item.id && !cache[current.id]) {
                    cache[item.id].childQuantity++
                    cache[item.id].children.push(current.id)
                    if (isOpen)
                        getHierarchy( current, depth + 1, folders)
                }
            }
        }

        if (open[FS.sep])
            folders.filter(item => !item.parent).forEach(item => {
                getHierarchy(item, 1, folders)
            })
        FilesHierarchyStore.updateStore({...FilesHierarchyStore.data, items: Object.values(cache)})
    }
}

