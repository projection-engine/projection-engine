import {fromDirectory} from "./FSOperations";
import {readFile} from "../../events/FSEvents";


export default async function loadData(projectPath) {
    let entities, settings, meta
    try {
        let res = (await readFile(projectPath + '\\.settings'))[1]
        settings = {type: 'settings', data: res ? JSON.parse(res) : {}}
        res = (await readFile(projectPath + '\\.meta'))[1]
        meta = {type: 'meta', data: res ? JSON.parse(res) : {}}
        entities = await fromDirectory(projectPath + '\\logic', '.entity')
        entities = await Promise.all(entities.map(e => {
            return new Promise(async resolve => {
                try {
                    const res = (await readFile(projectPath + '\\logic\\' + e))[1]
                    resolve({
                        type: 'entity', data: JSON.parse(res)
                    })
                } catch (e) {
                    console.log(e)
                    resolve()
                }
            })
        }))
        return {settings, meta, entities}
    } catch (e) {
        return {}
    }
}
