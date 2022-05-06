import GLTF from "./GLTF";
import {lzwEncode} from "../functions/lzString";

export default function glTFImporter(fs, resolvePath, newRoot, file, options, resolve, createRegistryEntry, path, importImage) {
    fs.mkdir(resolvePath(newRoot), async (err) => {
        if (!err) {
            const res = await new Promise(re => {
                let reader = new FileReader();
                reader.addEventListener('load', event => {
                    re(event.target.result)
                });
                reader.readAsText(file)
            })


            const {nodes, materials} = await GLTF.parseGLTF(res, file.path.replace(file.name, ''), options)

            let promises = []
            if (nodes) {
                promises.push(...nodes.map(d => {
                    return [
                        new Promise(r => {
                            fs.writeFile(
                                resolvePath(newRoot + `\\${d.name}.mesh`),
                                lzwEncode(JSON.stringify(d.data)),
                                () => {
                                    r()
                                });
                        }),
                        createRegistryEntry(undefined, newRoot.replace(path + '\\assets\\', '') + `\\${d.name}.mesh`)
                    ]
                }))
            }

            // if (materials && materials.length > 0) {
            //     fs.mkdir(resolvePath(newRoot + `\\Materials`), () => {
            //         fs.mkdir(resolvePath(newRoot + `\\Materials\\Resources`), () => {
            //             promises.push(...materials.map(d => {
            //                 let parsedData = {...emptyMaterial}
            //                 const keysOnRes = Object.keys(d.response)
            //                 parsedData.nodes = parsedData.nodes.filter(n => {
            //                     return keysOnRes.includes(n.id) || n.id === 'material'
            //                 })
            //                 parsedData.links = parsedData.links.filter(e => {
            //                     return keysOnRes.includes(e.target.attribute.key)
            //                 })
            //                 parsedData.nodes = parsedData.nodes.map(n => {
            //                     const newNode = {...n}
            //                     newNode.sample = {
            //                         type: n.id,
            //                         registryID: uuidv4()
            //                     }
            //                     return newNode
            //                 })
            //                 parsedData.response = d.response
            //                 parsedData.response.name = d.name
            //
            //                 let localPromises = [
            //                     new Promise(r => {
            //                         fs.writeFile(
            //                             resolvePath(newRoot + `\\Materials\\${d.name}.material`),
            //                             JSON.stringify(parsedData),
            //                             () => {
            //                                 r()
            //                             });
            //                     }),
            //                     createRegistryEntry(d.id, newRoot.replace(path + '\\assets\\', '') + `\\Materials\\${d.name}.material`)
            //                 ]
            //
            //                 parsedData.nodes.forEach((n, i) => {
            //                     let nameSplit = n.sample.registryID
            //                     nameSplit = nameSplit.substr(0, nameSplit.length / 2)
            //                     localPromises.push(...importImage(newRoot + '\\Materials\\Resources\\' + nameSplit, d.response[n.sample.type]?.high, n.sample.registryID))
            //                 })
            //
            //                 return localPromises
            //             }))
            //         })
            //     })
            // }
            await Promise.all(promises)
            resolve()
        } else
            resolve(err)
    })
}