import FileBlob from "./FileBlob";
import GLTF from "../gltf/GLTF";
import randomID from "../utils/misc/randomID";
import ImageProcessor from "./ImageProcessor";
import emptyMaterial from '../utils/emptyMaterial.json'
import TerrainWorker from "./TerrainWorker";

const fs = window.require('fs')
const pathRequire = window.require('path')

function resolvePath(p){
    return pathRequire.resolve(p)
}
export default class FileSystem {
    constructor(projectID) {

        this._path = (localStorage.getItem('basePath') + '\\projects\\' + projectID).replace(/\\\\/g, '\\')

        if (!fs.existsSync(this.path + '\\previews\\'))
            fs.mkdirSync(this.path + '\\previews\\')
        if (!fs.existsSync(this.path + '\\assets\\'))
            fs.mkdirSync(this.path + '\\assets\\')
        if (!fs.existsSync(this.path + '\\assetsRegistry\\'))
            fs.mkdirSync(this.path + '\\assetsRegistry\\')
        if (!fs.existsSync(this.path + '\\logic'))
            fs.mkdirSync(this.path + '\\logic')

    }

    get path() {
        return this._path
    }

    async readFile(pathName, type) {
        return new Promise(resolve => {
            switch (type) {
                case 'json':
                    fs.readFile(pathName, (e, res) => {
                        try {
                            resolve(JSON.parse(res.toString()))
                        } catch (e) {
                            resolve(null)
                        }
                    })
                    break
                case 'base64':
                    fs.readFile(pathName, 'base64', (e, res) => {
                        if (!e)
                            resolve(res.toString())
                        else
                            resolve(null)
                    })
                    break
                default:
                    fs.readFile(pathName, (e, res) => {
                        if (!e)
                            resolve(res.toString())
                        else
                            resolve(null)
                    })
                    break
            }
        })
    }

    async findRegistry(p) {
        return new Promise(resolve => {
            fs.readdir(resolvePath(this.path + '\\assetsRegistry'), (e, res) => {
                if (res) {
                    Promise
                        .all(
                            res.map(data => {
                                return this.readRegistryFile(data.replace('.reg', ''))
                            })
                        )
                        .then(registryData => {
                            const parsedPath = pathRequire.resolve(p)

                            resolve(registryData.filter(f => f !== undefined).find(f => {
                                return parsedPath.includes(f.path)
                            }))
                        })
                } else resolve()
            })
        })
    }

    async deleteFile(pathName, absolute) {
        const currentPath = absolute ? pathName : (this._path + pathName)
        return new Promise(resolve => {
            fs.rm(currentPath, () => {
                this.findRegistry(currentPath)
                    .then(rs => {

                        if (rs) {
                            fs.rm(resolvePath(this.path + '\\assetsRegistry\\' + rs.id + '.reg'), () => {
                                resolve()
                            })
                        } else resolve()
                    })


            })
        })
    }

    importImage(newRoot, res, fileID) {
        if (res)
            return [
                new Promise(r => {
                    fs.writeFile(
                        newRoot + `.pimg`,
                        res,
                        () => {
                            r()
                        })
                }),
                new Promise(r => {
                    ImageProcessor.resizeImage(res, 256, 256).then(reduced => {
                        fs.writeFile(
                            resolvePath(this.path + '\\previews\\' + fileID + `.preview`),
                            reduced,
                            (error) => {
                                r()
                            })
                    })
                }),
                this.createRegistryEntry(fileID, newRoot.replace(this.path + '\\assets\\', '') + `.pimg`)
            ]
        else return []
    }

    async importFile(file, filePath, asHeightMap, options) {
        return new Promise(resolve => {

            const newRoot = filePath + '\\' + file.name.split(/\.([a-zA-Z0-9]+)$/)[0]
            const fileID = randomID()
            switch (file.name.split(/\.([a-zA-Z0-9]+)$/)[1]) {
                case 'png':
                case 'jpg':
                case 'jpeg': {
                    FileBlob
                        .loadAsString(file, false, true)
                        .then(res => {
                            if (asHeightMap)
                                TerrainWorker.loadHeightMap(res, options)
                                    .then(data => {
                                        Promise.all( [
                                            new Promise(r => {
                                                fs.writeFile(
                                                    resolvePath(newRoot + `.terrain`),
                                                    JSON.stringify(data),
                                                    () => {
                                                        r()
                                                    });
                                            }),
                                            this.createRegistryEntry(undefined, newRoot.replace(this.path + '\\assets\\', '') + `.terrain`)
                                        ]).then(() => resolve())
                                    })
                            else
                                Promise.all(this.importImage(newRoot, res, fileID))
                                    .then(() => {
                                        resolve()
                                    })
                        })
                    break
                }
                case 'gltf':
                    fs.mkdir(resolvePath(newRoot), (err) => {
                        if (!err)
                            FileBlob
                                .loadAsString(file)
                                .then(res => {
                                    GLTF
                                        .parseGLTF(res, file.path.replace(file.name, ''), options)
                                        .then(({nodes, materials}) => {
                                            let promises = []
                                            if (nodes) {
                                                promises.push(...nodes.map(d => {
                                                    return [
                                                        new Promise(r => {
                                                            fs.writeFile(
                                                                resolvePath(newRoot + `\\${d.name}.mesh`),
                                                                JSON.stringify(d.data),
                                                                () => {
                                                                    r()
                                                                });
                                                        }),
                                                        this.createRegistryEntry(undefined, newRoot.replace(this.path + '\\assets\\', '') + `\\${d.name}.mesh`)
                                                    ]
                                                }))
                                            }

                                            if (materials && materials.length > 0) {
                                                fs.mkdir(resolvePath(newRoot + `\\Materials`), () => {
                                                    fs.mkdir(resolvePath(newRoot + `\\Materials\\Resources`), () => {
                                                        promises.push(...materials.map(d => {
                                                            let parsedData = {...emptyMaterial}
                                                            const keysOnRes = Object.keys(d.response)
                                                            parsedData.nodes = parsedData.nodes.filter(n => {
                                                                return keysOnRes.includes(n.id) || n.id === 'material'
                                                            })
                                                            parsedData.links = parsedData.links.filter(e => {
                                                                return keysOnRes.includes(e.target.attribute.key)
                                                            })

                                                            parsedData.nodes = parsedData.nodes.map(n => {
                                                                const newNode = {...n}
                                                                newNode.sample = {
                                                                    type: n.id,
                                                                    registryID: randomID()
                                                                }
                                                                return newNode
                                                            })

                                                            parsedData.response = {
                                                                ...d.response,
                                                                name: d.name
                                                            }

                                                            let localPromises = [
                                                                new Promise(r => {
                                                                    fs.writeFile(
                                                                        resolvePath(newRoot + `\\Materials\\${d.name}.material`),
                                                                        JSON.stringify(parsedData),
                                                                        () => {
                                                                            r()
                                                                        });
                                                                }),
                                                                this.createRegistryEntry(d.id, newRoot.replace(this.path + '\\assets\\', '') + `\\Materials\\${d.name}.material`)
                                                            ]

                                                            parsedData.nodes.forEach((n, i) => {
                                                                let nameSplit = n.sample.registryID
                                                                nameSplit = nameSplit.substr(0, nameSplit.length / 2)
                                                                localPromises.push(...this.importImage(newRoot + '\\Materials\\Resources\\' + nameSplit, d.response[n.sample.type], n.sample.registryID))
                                                            })

                                                            return localPromises
                                                        }))
                                                    })
                                                })
                                            }
                                            Promise.all(promises)
                                                .then(() => {
                                                    resolve()
                                                })
                                        })
                                })
                        else
                            resolve(err)
                    })
                    break
                default:
                    resolve()
                    break
            }

        })
    }

    createRegistryEntry(fID = randomID(), path) {
        const pathRe = resolvePath(this.path+ '\\assets\\')

        return new Promise(r => {
            fs.writeFile(
                resolvePath(this.path + '\\assetsRegistry\\' + fID + `.reg`),
                JSON.stringify({
                    id: fID,
                    path: resolvePath(this.path + '\\assets\\'+ path).replace(pathRe, '')
                }),
                () => {
                    r()
                })
        })
    }

    async readRegistryFile(id) {
        return new Promise(resolve => {
            fs.readFile(resolvePath(this.path + '\\assetsRegistry\\' + id + '.reg'), (e, res) => {
                if (!e) {
                    try {
                        resolve(JSON.parse(res.toString()))
                    } catch (e) {
                        resolve()
                    }
                } else
                    resolve()

            })
        })
    }

    assetExists(path) {
        return fs.existsSync(this.path + '\\assets\\' + path)
    }

    async writeAsset(path, fileData, previewImage, registryID) {
        const fileID = registryID !== undefined ? registryID : randomID()
        return new Promise(resolve => {
            const promises = [
                new Promise(resolve1 => {
                    fs.writeFile(resolvePath(this.path + '\\assets\\' + path), fileData, (err) => {
                        if (!previewImage)
                            resolve1()
                        else {
                            fs.writeFile(resolvePath(this.path + '\\previews\\' + registryID + '.preview'), previewImage, () => {
                                resolve1()
                            })
                        }

                    })
                }),
                this.createRegistryEntry(fileID, path)
            ]

            Promise.all(promises)
                .then(() => {
                    resolve()
                })

        })
    }


    async updateAsset(registryID, fileData, previewImage) {
        return new Promise(resolve => {
            if (!fs.existsSync(resolvePath(this.path + '\\assets')))
                fs.mkdir(resolvePath(this.path + '\\assets'), () => null)
            this.readRegistryFile(registryID)
                .then(res => {
                    this.writeAsset(res.path, fileData, previewImage, registryID)
                        .then(() => resolve())
                })

        })
    }

    deleteEntity(entityID) {
        return new Promise(resolve => {
            this.deleteFile(this.path + '\\logic\\' + entityID + '.entity', true)
                .then(() => resolve())
                .catch(() => resolve())
        })
    }

    async updateEntity(entity) {

        return new Promise(resolve => {
            fs.writeFile(resolvePath(this.path + '\\logic\\' + entity.id + '.entity'), JSON.stringify(entity), (e) => {
                resolve()
            })
        })
    }

    async updateProject(meta, settings) {
        return Promise.all([
            new Promise(resolve => {

                if (meta)

                    fs.writeFile(resolvePath(this.path + '\\.meta'), JSON.stringify(meta), () => {
                        resolve()
                    })

                else
                    resolve()
            }),

            new Promise(resolve => {
                if (settings) {
                    let sett = {...settings}
                    delete sett.type
                    delete sett.data

                    fs.writeFile(resolvePath(this.path + '\\.settings'), JSON.stringify(sett), () => {
                        resolve()
                    })
                } else
                    resolve()
            })
        ])
    }


    dirStructure(dir, done) {
        let results = [];
        if (fs.existsSync(dir))
            fs.readdir(dir, (err, list) => {
                if (err) return done([]);
                let pending = list.length;
                if (!pending) return done(results);
                list.forEach((file) => {
                    file = pathRequire.resolve(dir, file);
                    fs.stat(file, (err, stat) => {
                        results.push(file);
                        if (stat && stat.isDirectory()) {
                            this.dirStructure(file, (res) => {
                                results = results.concat(res)
                                if (!--pending) done(results)
                            })
                        } else if (!--pending) done(results)
                    })
                })
            })
        else
            done([])

    }

    fromDirectory(startPath, extension) {

        if (!fs.existsSync(startPath)) {
            return []
        }
        let res = []
        let files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++) {
            let filename = pathRequire.join(startPath, files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory())
                res.push(...this.fromDirectory(filename, extension))
            else if (filename.indexOf(extension) >= 0)
                res.push(files[i])
        }

        return res
    }

    foldersFromDirectory(startPath) {

        if (!fs.existsSync(startPath)) {
            return []
        }
        let res = []
        let files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++) {
            let filename = pathRequire.join(startPath, files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory())
                res.push(filename)
        }

        return res
    }

    readRegistry() {
        return new Promise(resolve => {
            fs.readdir(this.path + '\\assetsRegistry\\', (e, res) => {
                if (!e) {
                    let promises = res.map(f => {
                        return new Promise(resolve1 => {
                            const registryPath = this.path + '\\assetsRegistry\\' + f
                            fs.readFile(registryPath, (e, registryFile) => {
                                if (!e)
                                    try {
                                        resolve1({
                                            ...JSON.parse(registryFile.toString()),
                                            registryPath
                                        })
                                    } catch (e) {
                                        resolve1()
                                    }
                                else
                                    resolve1()
                            })
                        })
                    })

                    Promise.all(promises).then(registryFiles => {
                        resolve(registryFiles
                            .filter(f => f !== undefined))
                    })
                } else
                    resolve([])
            })
        })
    }

    async rename(from, to) {
        const fromResolved = pathRequire.resolve(from)

        let newRegistry = await this.readRegistry()

        return new Promise(rootResolve => {
            fs.lstat(fromResolved, (er, stat) => {
                if (stat !== undefined && stat.isDirectory())
                    fs.mkdir(to, () => {
                        fs.readdir(fromResolved, (error, res) => {
                            if (res) {
                                let promises = []
                                res.forEach(file => {
                                    const oldPath = fromResolved + `/${file}`
                                    const newPath = to + `/${file}`;

                                    if (fs.lstatSync(oldPath).isDirectory())
                                        promises.push(this.rename(oldPath, newPath))
                                    else
                                        promises
                                            .push(
                                                new Promise(resolve => {
                                                    fs.rename(
                                                        oldPath,
                                                        newPath,
                                                        (err) => {
                                                            resolve(err)
                                                        }
                                                    )
                                                }),
                                                this.updateRegistry(oldPath, newPath, newRegistry)
                                            )
                                })
                                Promise.all(promises)
                                    .then((errors) => {
                                        fs.rm(fromResolved, {recursive: true, force: true}, (e) => {
                                            rootResolve(errors)
                                        })

                                    })
                            } else
                                rootResolve(error)
                        })
                    })
                else if (stat !== undefined) {
                    let promises = [
                        new Promise(resolve => {
                            fs.rename(
                                fromResolved,
                                to,
                                (err) => {
                                    resolve(err)
                                }
                            )
                        }),
                        this.updateRegistry(from, to, newRegistry)
                    ]
                    Promise.all(promises)
                        .then((errors) => {
                            rootResolve()
                        })
                } else
                    rootResolve(er)
            })
        })

    }

    async updateRegistry(from, to, registryData) {
        const assetsResolved = pathRequire.resolve(this.path + '\\assets\\')
        const fromResolved = pathRequire.resolve(from).replace(assetsResolved, '')
        const toResolved = pathRequire.resolve(to)

        return new Promise(resolve => {
            const registryFound = registryData.find(reg => {
                const regResolved = pathRequire.resolve(this.path + '\\assets\\' + reg.path).replace(assetsResolved, '')
                return regResolved === fromResolved
            })
            if (registryFound) {
                fs.writeFile(registryFound.registryPath, JSON.stringify({
                    id: registryFound.id,
                    path: toResolved.replace(assetsResolved, '')
                }), () => {
                    resolve(registryFound.registryPath, registryFound)
                })
            } else
                resolve()
        })
    }

    static async createProject(name) {
        return new Promise(resolve => {
            const projectID = randomID(), projectPath = localStorage.getItem('basePath') + 'projects\\' + projectID
            if (!fs.existsSync(resolvePath(localStorage.getItem('basePath') + 'projects')))
                fs.mkdirSync(resolvePath(localStorage.getItem('basePath') + 'projects'))

            fs.mkdir(projectPath, () => {
                fs.writeFile(resolvePath(projectPath + '/.meta'), JSON.stringify({
                    id: projectID,
                    name: name,
                    creationDate: new Date().toDateString()
                }), () => {
                    resolve(projectID)
                })
            })
        })

    }
}


