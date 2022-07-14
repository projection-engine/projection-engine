import {useEffect, useState} from "react"
import {getCall} from "../libs/AsyncFS"
import FileSystem from "../libs/FileSystem"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"


export default function useFiles(engine) {
    const  PATH = window.fileSystem.path + FileSystem.sep + "assets"
    const [items, setItems] = useState([])
    const [bookmarks, setBookmarks] = useState([])

    const [loading, setLoading] = useState(false)

    async function refreshFiles(){
        setLoading(true)
        window.fileSystem.refresh()
        const done = await getCall("refresh-files", {pathName: PATH})
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
        refreshFiles().catch()
    }, [])

    return {
        removeEntity:(entities) => {
            engine.setSelected([])
            entities.forEach(entity => window.fileSystem.deleteEntity(entity))
            engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: entities})
        },
        refreshFiles,
        loading,
        path: PATH,
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
