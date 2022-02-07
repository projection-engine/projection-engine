import importMesh from "./parsers/importMesh";

export default function handleDrop(event, database, engine, setAlert) {
    let data = event.dataTransfer.getData("text")
    database.getFileWithBlob(data).then(f => {
        if(typeof f === "object")
            importMesh(f, engine, setAlert)
        else
            setAlert({
                type: 'info',
                message: 'Not a mesh file.'
            })
    }).catch(e => {

        setAlert({
            type: 'info',
            message: 'Not a mesh file.'
        })
    })

}