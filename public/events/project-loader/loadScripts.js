import {readFromRegistry} from "./FSOperations"

export default async function loadScripts(toLoad, meshesLoaded, mapEntities = true, projectPath) {

    const promises = toLoad.map(m => {
        return new Promise(async r => {
            const fileData = await readFromRegistry(m, projectPath)

            if (fileData) try {
                const d = JSON.parse(fileData)
                r({
                    script: {
                        id: m, executors: d.response, name: d.name
                    }, entities: mapEntities ? d.entities : []
                })
            } catch (e) {
                r({
                    script: {
                        id: m, executors: fileData
                    }, entities: []
                })
            } else r()
        })
    })

    return await Promise.all(promises)
}

