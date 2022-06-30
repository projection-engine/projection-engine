import {useEffect, useState} from "react"
import AsyncFS from "../../project/templates/AsyncFS"
import FileSystem from "../../project/utils/files/FileSystem"
import EN from "../../static/locale/EN"

const path = window.require("path")

export default function useProjects() {
    const [projects, setProjects] = useState([])
    const [startPath, setStartPath] = useState("")
    const [loading, setLoading] = useState(true)

    async function refresh (path) {
        const [e, res] = await AsyncFS.readdir(path)
        if (!(await AsyncFS.exists(path))) await AsyncFS.mkdir(path)

        if (!e) {
            const data = []
            for (let i in res) {
                const f = res[i]
                let filename = path + f
                const [, stat] = await AsyncFS.lstat(filename)
                if (stat && stat.isDirectory) {
                    const [, meta] = await AsyncFS.read(filename + "/.meta")
                    const [, settings] = await AsyncFS.read(filename + "/.settings")
                    const parts = filename.split(FileSystem.sep)
                    data.push({
                        id: parts.pop(),
                        meta: meta ? JSON.parse(meta) : undefined,
                        settings: settings ? JSON.parse(settings) : undefined
                    })
                }
            }
            setProjects(data.filter(e => e !== undefined).map(e => {
                let res = {...e}
                if (!res.meta) res.meta = {name: EN.FILE.NEW_PROJECT}
                if (!res.settings) res.settings = {}

                if (!res.meta.name) res.meta.name = EN.FILE.NEW_PROJECT
                return res
            }))
            setLoading(false)
        }
    }

    useEffect(() => {

        let b = localStorage.getItem("basePath")
        if (localStorage.getItem("basePath") === null) {
            b = window.require("os").homedir() + path.sep + "ProjectionEngineProjects" + path.sep
            localStorage.setItem("basePath", b)
        }
        AsyncFS.mkdir(b).catch()
        setStartPath(b + "projects")
        refresh(b + "projects" + FileSystem.sep).catch()

    }, [])

    return {
        loading,
        projects,
        setProjects,
        startPath,
        setStartPath
    }
}