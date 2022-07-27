const {fromDirectory} = require("./fs-operations")
const {readFile} = require( "../../file-system/fs-essentials")
const pathRequire = require("path")
module.exports =  async function loadEntities(projectPath) {
    let entities
    try {
        entities = await fromDirectory(projectPath + pathRequire.sep + "logic", ".entity")
        entities = await Promise.all(entities.map(e => {
            return new Promise(async resolve => {
                try {
                    const res = (await readFile(projectPath + pathRequire.sep + "logic" +pathRequire.sep +  e))[1]
                    resolve({
                        type: "entity", data: JSON.parse(res)
                    })
                } catch (e) {

                    resolve()
                }
            })
        }))
        return  entities.filter(e => e)
    } catch (e) {
        console.log(e)
        return []
    }
}
