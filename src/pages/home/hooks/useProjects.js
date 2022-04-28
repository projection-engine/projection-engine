import {AlertProvider} from "@f-ui/core";
import EVENTS from "../../project/utils/utils/EVENTS";
import {useContext, useEffect, useRef, useState} from "react";
import LoaderProvider from "../../../components/loader/LoaderProvider";

export default function useProjects(fs){
    const [projects, setProjects] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [startPath, setStartPath] = useState( )
    const load = useContext(LoaderProvider)
    const alert = useContext(AlertProvider)

    const uploadRef = useRef()

    const refresh = (path) => {
        load.pushEvent(EVENTS.PROJECT_LIST)
        fs.readdir(path, (e, res) => {
            let promises = []
            if(!fs.existsSync(path))
                fs.mkdirSync(path)
            if (!e)
                res.forEach(f => {
                    promises.push(new Promise((resolve,) => {
                        let filename = path + f;

                        fs.lstat(filename, (e, stat) => {
                            if (stat && stat.isDirectory()) {
                                const meta = new Promise(r => fs.readFile(filename + '/.meta', (e, rs) => r(rs)))
                                const settings = new Promise(r => fs.readFile(filename + '/.settings', (e, rs) => r(rs)))
                                const parts = filename.split('\\')

                                Promise.all([meta, settings])
                                    .then(r => {

                                        resolve({
                                            id: parts.pop(),
                                            meta: r[0] ? JSON.parse(r[0].toString()) : undefined,
                                            settings: r[1] ? JSON.parse(r[1].toString()) : undefined
                                        })
                                    })

                            } else
                                resolve()
                        })

                    }))
                })

            Promise.all(promises)
                .then(data => {
                    setProjects(data.filter(e => e !== undefined).map(e => {
                        let res = {...e}
                        if(!res.meta)
                            res.meta = {name: 'New project'}
                        if(!res.settings)
                            res.settings = {}

                        if(!res.meta.name)
                            res.meta.name = 'New project'
                        return res
                    }))
                    load.finishEvent(EVENTS.PROJECT_LIST)
                })
        })
    }

    useEffect(() => {
        let b = localStorage.getItem('basePath')
        if (localStorage.getItem('basePath') === null) {
            b = window.require("os").homedir() + '\\ProjectionEngineProjects\\'
            localStorage.setItem('basePath', b)
        }
        setStartPath(b  + '\\projects\\')
        refresh(b  + '\\projects\\')

    }, [])

    return {
        projects,setProjects,
        openModal, setOpenModal,
        projectName, setProjectName,
        setAlert: ({type, message}) => alert.pushAlert(message, type),
        load, uploadRef,
        refresh,
        startPath, setStartPath
    }
}