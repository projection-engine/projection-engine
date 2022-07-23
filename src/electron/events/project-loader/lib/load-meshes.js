const {readFromRegistry} =  require( "./fs-operations")


module.exports =  async function loadMeshes(toLoad, projectPath, callback) {
    for (let i in toLoad) {
        const m = toLoad[i]
        const fileData = await readFromRegistry(m, projectPath)

        if (fileData) {
            const parsed = JSON.parse(fileData)
            parsed.id = m
            callback(parsed)
        }
    }
}