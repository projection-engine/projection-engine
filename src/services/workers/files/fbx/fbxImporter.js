import PrimitiveProcessor from "../gltf/workers/PrimitiveProcessor";

export default function fbxImporter(fs, resolvePath, newRoot, file, options, resolve, createRegistryEntry, path, importImage){
    fs.mkdir(resolvePath(newRoot), async (err) => {
        let reader = new FileReader();
        const data = await new Promise(resolve1 => {
            reader.onload = function () {
                let arrayBuffer = new Uint8Array(reader.result);
                const assimpjs = window.require('assimpjs')();
                assimpjs.then((ajs) => {
                    // create new file list object
                    let fileList = new ajs.FileList();

                    // add model files
                    fileList.AddFile(
                        'ee.fbx',
                        arrayBuffer
                    );


                    // convert file list to assimp json
                    let result = ajs.ConvertFileList(fileList, 'assjson');

                    // check if the conversion succeeded
                    if (!result.IsSuccess() || result.FileCount() === 0) {
                        console.log(result.GetErrorCode());
                        return;
                    }

                    // get the result file, and convert to string
                    let resultFile = result.GetFile(0);
                    let jsonContent = new TextDecoder().decode(resultFile.GetContent());

                    // parse the result json
                    try {
                        jsonContent = JSON.parse(jsonContent)
                        resolve1(jsonContent)
                    } catch (e) {
                        resolve1()
                    }
                })
            }
            reader.readAsArrayBuffer(file);
        })

        let promises = []
        promises.push(...data.meshes.map(d => {

            return [
                new Promise(r => {
                    fs.writeFile(
                        resolvePath(newRoot + `\\${d.name}.mesh`),
                        JSON.stringify({
                            indices: d.faces.flat(),
                            vertices: d.vertices,
                            tangents: PrimitiveProcessor.computeTangents(d.faces.flat(), d.vertices, d.texturecoords[0], d.normals),
                            normals: d.normals,
                            uvs: d.texturecoords[0],
                            maxBoundingBox: [0, 0, 0],
                            minBoundingBox: [0, 0, 0],
                            name: d.name,
                            scaling: [
                                1,
                                1,
                                1
                            ],
                            translation: [0, 0, 0],
                            rotationQuad: [0, 0, 0, 1]
                        }),
                        (err) => {
                            console.log(err)
                            r()
                        });
                }),
                createRegistryEntry(undefined, newRoot.replace(path + '\\assets\\', '') + `\\${d.name}.mesh`)
            ]
        }))
        Promise.all(promises)
            .then(() => resolve())
            .catch(e => {
                console.log(e)
                resolve()
            })
    })
}