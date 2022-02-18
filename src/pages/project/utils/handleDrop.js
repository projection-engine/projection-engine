import importMesh from "./parsers/importMesh";

export default function handleDrop(event, fileSystem, engine, setAlert) {
    let entities = []

    try {
        entities = JSON.parse(event.dataTransfer.getData("text"))
    } catch (e) {
    }

    for (let i = 0; i < entities.length; i++) {
        const data = entities[i]
        fileSystem.readRegistryFile(data)
            .then(res => {
                if (res && res.path.includes('.mesh'))
                    fileSystem.readFile(fileSystem.path + '\\assets\\' + res.path, 'json')
                        .then(mesh => {
                            importMesh(mesh, engine, setAlert, data, i)
                        })
                else
                    setAlert({
                        type: 'info',
                        message: 'Not a mesh file.'
                    })
            })
    }

}