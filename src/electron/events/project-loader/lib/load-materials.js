const {readFromRegistry} = require( "./fs-operations")

module.exports =  async function loadMaterials(toLoad, projectPath, callback) {

    for (let i in toLoad) {
        const m = toLoad[i]
        const fileData = await readFromRegistry(m, projectPath)
        if (fileData) {
            try {
                const fileParsed = JSON.parse(fileData)
                if (Object.keys(fileParsed).length > 0)
                    callback({
                        result: fileParsed.response, id: m
                    })
            } catch (e) {
                console.error(e)
            }
        }
    }
}