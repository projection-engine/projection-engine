import importMesh from "./parsers/importMesh";

export default function handleDrop(event, fileSystem, engine, setAlert) {
    let data = event.dataTransfer.getData("text")

    if (data) {
        const possiblePath = fileSystem.path + '\\assetsRegistry\\' + data + '.reg'

        fileSystem.readFile(possiblePath, 'json')
            .then(res => {

                if (res && res.path.includes('.mesh'))
                    fileSystem.readFile(fileSystem.path + '\\assets\\' + res.path, 'json')
                        .then(mesh => {

                            importMesh(mesh, engine, setAlert, data)
                        })
                else
                    setAlert({
                        type: 'info',
                        message: 'Not a mesh file.'
                    })
            })
    } else
        setAlert({
            type: 'error',
            message: 'Error loading file.'
        })


}