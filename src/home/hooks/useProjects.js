import {useEffect, useMemo, useState} from "react"
import AsyncFS from "../../project/libs/AsyncFS"
import FileSystem from "../../project/libs/FileSystem"
import EN from "../../global/EN"
import loadGlobalLocalization from "../../global/loadGlobalLocalization"
import {useAlert} from "@f-ui/core"

const path = window.require("path")

export default function useProjects() {
    const [projects, setProjects] = useState([])
    const [startPath, setStartPath] = useState("")
    const [loading, setLoading] = useState(true)
    const [searchString, setSearchString] = useState("")
    useAlert(true)


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
        loadGlobalLocalization()
        let b = localStorage.getItem("basePath")
        if (localStorage.getItem("basePath") === null) {
            b = window.require("os").homedir() + path.sep + "ProjectionEngineProjects" + path.sep
            localStorage.setItem("basePath", b)
        }
        AsyncFS.mkdir(b).catch()
        setStartPath(b + "projects")
        refresh(b + "projects" + FileSystem.sep).catch()

    }, [])
    const projectsToShow = useMemo(() => {
        return projects
            .filter(p => p.meta.name?.toLowerCase().includes(searchString.toLowerCase()))
    }, [searchString, projects])
    return {
        projectsToShow,
        searchString,
        setSearchString,
        setProjects,
    }
}