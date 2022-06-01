import {fromDirectory} from "./FSOperations"
import {readFile} from "../../events/FSEvents"
import PathSep from "../../PathSep"


export default async function loadData(projectPath) {
    let entities, settings, meta
    try {
        let res = (await readFile(projectPath + PathSep.sep + ".settings"))[1]
        settings = {type: "settings", data: res ? JSON.parse(res) : {}}
        res = (await readFile(projectPath + PathSep.sep + ".meta"))[1]
        meta = {type: "meta", data: res ? JSON.parse(res) : {}}
        entities = await fromDirectory(projectPath + PathSep.sep + "logic", ".entity")

        entities = await Promise.all(entities.map(e => {
            return new Promise(async resolve => {
                try {
                    const res = (await readFile(projectPath + PathSep.sep + "logic" +PathSep.sep +  e))[1]
                    resolve({
                        type: "entity", data: JSON.parse(res)
                    })
                } catch (e) {

                    resolve()
                }
            })
        }))
        return {settings, meta, entities: entities.filter(e => e)}
    } catch (e) {
        return {}
    }
}
