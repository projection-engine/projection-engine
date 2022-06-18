import {useCallback, useEffect, useMemo, useState} from "react"
import {getCall} from "../templates/AsyncFS"
import FileSystem from "../utils/files/FileSystem"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"

export default function useFiles(engine) {
    const [items, setItems] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const path = useMemo(() => document.fileSystem.path + FileSystem.sep + "assets", [])
    const [loading, setLoading] = useState(false)

    async function refreshFiles(){
        setLoading(true)
        document.fileSystem.refresh()
        const done = await getCall("refresh-files", {pathName: path})
        setLoading(false)
        setItems(done)
    }
    useEffect(() => {
        document.fileSystem.readFile(document.fileSystem.path + FileSystem.sep + "bookmarks.meta", "json")
            .then(res => {
                if (res)
                    setBookmarks(res)
            })
    }, [])
    useEffect(() => {
        refreshFiles().catch()
    }, [])
    const removeEntity=useCallback((entities) => {
        engine.setSelected([])
        engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: entities})
        entities.forEach(entity => document.fileSystem.deleteEntity(entity))
    }, [engine.entities])


    return {
        removeEntity,
        entities: engine.entities,

        refreshFiles,
        loading,
        path,
        items,
        setItems,
        bookmarks,
        removeBlock: (v) => {
            setBookmarks(prev => {
                const n = prev.filter(i => !v.includes(i.path))
                document.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
                return n
            })
        },
        addBookmark:  (id) => {
            setBookmarks(prev => {
                const n = [...prev, {
                    name: id.split(FileSystem.sep ).pop(),
                    path: id
                }]
                document.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta",JSON.stringify(n)).catch()
                return n
            })
        } ,
        removeBookmark: (id) => {
            setBookmarks(prev => {
                const n = prev.filter(i => i.path !== id)
                document.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
                return n
            })
        } ,
        renameBookmark:  (id, newPath) => {
            setBookmarks(prev => {
                const p = prev.filter(i => i.path !== id)
                const n =  [...p, {
                    name: newPath.split(FileSystem.sep).pop(),
                    path: newPath
                }]
                document.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
                return n
            })
        }

    }
}
