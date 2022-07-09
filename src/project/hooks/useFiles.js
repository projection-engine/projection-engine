import {useCallback, useEffect, useMemo, useState} from "react"
import {getCall} from "../utils/AsyncFS"
import FileSystem from "../utils/files/FileSystem"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"

export default function useFiles(engine) {
    const [items, setItems] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const path = useMemo(() => window.fileSystem.path + FileSystem.sep + "assets", [])
    const [loading, setLoading] = useState(false)

    async function refreshFiles(){
        setLoading(true)
        window.fileSystem.refresh()
        const done = await getCall("refresh-files", {pathName: path})
        setLoading(false)
        setItems(done)
    }
    useEffect(() => {
        window
            .fileSystem
            .readFile(window.fileSystem.path + FileSystem.sep + "bookmarks.meta", "json")
            .then(res => {
                console.log(res)
                if (res)
                    setBookmarks(res)
            })
    }, [])
    useEffect(() => {
        refreshFiles().catch()
    }, [])
    const removeEntity = useCallback(() => {
        engine.setSelected([])
        engine.entities.forEach(entity => window.fileSystem.deleteEntity(entity.id))
        engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: engine.entities})
    }, [engine.entities])

    return {
        removeEntity,
        refreshFiles,
        loading,
        path,
        items,
        setItems,
        bookmarks,
        removeBlock: (v) => {
            setBookmarks(prev => {
                const n = prev.filter(i => !v.includes(i.path))
                window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
                return n
            })
        },
        addBookmark:  (id) => {
            setBookmarks(prev => {
                const n = [...prev, {
                    name: id.split(FileSystem.sep ).pop(),
                    path: id
                }]
                window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta",JSON.stringify(n)).catch()
                return n
            })
        } ,
        removeBookmark: (id) => {
            setBookmarks(prev => {
                const n = prev.filter(i => i.path !== id)
                window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
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
                window.fileSystem.writeFile(FileSystem.sep + "bookmarks.meta", JSON.stringify(n)).catch()
                return n
            })
        }

    }
}
