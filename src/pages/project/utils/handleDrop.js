import importMesh from "./parsers/importMesh";

export default function handleDrop(event, fileSystem, engine, setAlert) {
    let data = event.dataTransfer.getData("text")
    const fs = window.require('fs')
    if (data)
        fs.lstat(data, (e, res) => {
            if (!e && !res.isDirectory())
                fileSystem.readFile(data, 'json')
                    .then(res => {
                        importMesh(res, engine, setAlert, data)
                    })
            else
                setAlert({
                    type: 'info',
                    message: 'Not a mesh file.'
                })
        })
    else
        setAlert({
            type: 'info',
            message: 'Not a mesh file.'
        })


}