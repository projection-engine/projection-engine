export default function openFile(openFiles, setOpenTab, setOpenFiles, registryID, label, type){
    const index = openFiles.findIndex(o => o.registryID === registryID)
    if(index === -1) {
        setOpenTab(openFiles.length + 1)
        setOpenFiles(prev => {
            return [...prev, {
                registryID, label, type
            }]
        })
    }
    else
        setOpenTab(index)
}