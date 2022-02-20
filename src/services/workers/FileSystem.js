import FileBlob from "./FileBlob";
import GLTF from "../gltf/GLTF";
import randomID from "../../pages/project/utils/misc/randomID";
import ImageProcessor from "./ImageProcessor";
import emptyMaterial from '../utils/emptyMaterial.json'

const fs = window.require('fs')
const path = window.require('path')

export default class FileSystem {
    constructor(projectID) {

        this._path = (localStorage.getItem('basePath') + '\\projects\\' + projectID).replace(/\\\\/g, '\\')
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
            fs.readdir(this.path + '\\assetsRegistry', (e, res) => {
                if (res) {
                    Promise
                        .all(
                            res.map(data => {
                                return this.readRegistryFile(data.replace('.reg', ''))
                            })
                        )
                        .then(registryData => {
                            const parsedPath = path.resolve(p)

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
                            fs.rm(this.path + '\\assetsRegistry\\' + rs.id + '.reg', () => {
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
                    if (!fs.existsSync(this.path + '\\previews\\'))
                        fs.mkdirSync(this.path + '\\previews\\')
                    ImageProcessor.reduceImage(res).then(reduced => {
                        fs.writeFile(
                            this.path + '\\previews\\' + fileID + `.preview`,
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

    async importFile(file, filePath) {
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
                            Promise.all(this.importImage(newRoot, res, fileID))
                                .then(() => {
                                    resolve()
                                })
                        })
                    break
                }
                case 'gltf':
                    fs.mkdir(newRoot, (err) => {
                        if (!err)
                            FileBlob
                                .loadAsString(file)
                                .then(res => {
                                    GLTF
                                        .parseGLTF(res, file.path.replace(file.name, ''))
                                        .then(({nodes, materials}) => {
                                            let promises = []
                                            if (nodes) {
                                                promises.push(...nodes.map(d => {
                                                    return [
                                                        new Promise(r => {
                                                            fs.writeFile(
                                                                newRoot + `\\${d.name}.mesh`,
                                                                JSON.stringify(d.data),
                                                                () => {
                                                                    r()
                                                                });
                                                        }),
                                                        this.createRegistryEntry(undefined, newRoot.replace(this.path + '\\assets\\', '') + `\\${d.name}.mesh`)
                                                    ]
                                                }))
                                            }

                                            if (materials) {
                                                fs.mkdir(newRoot + `\\Materials`, () => {
                                                    fs.mkdir(newRoot + `\\Materials\\Resources`, () => {
                                                        promises.push(...materials.map(d => {
                                                            let parsedData = {...emptyMaterial}
                                                            const keysOnRes = Object.keys(d.response)
                                                            parsedData.nodes = parsedData.nodes.filter(n => {
                                                                const willContinue = keysOnRes.includes(n.id) || n.id === 'material'
                                                                parsedData.links = parsedData.links.filter(l => {
                                                                    return keysOnRes.includes(l.source.id) && (keysOnRes.includes(l.target.id) || l.target.id === 'material')
                                                                })
                                                                return willContinue
                                                            }).map(n => {
                                                                const newID = randomID()
                                                                parsedData.links = parsedData.links.map(l => {
                                                                    if (l.source.id === n.id || l.target.id === n.id) {
                                                                        const newLink = {...l}
                                                                        if (l.target.id === n.id)
                                                                            newLink.target.id = newID
                                                                        else
                                                                            newLink.source.id = newID
                                                                        return newLink
                                                                    } else
                                                                        return l
                                                                })
                                                                const newNode = {...n}
                                                                newNode.id = newID
                                                                newNode.sample = {
                                                                    type: n.id,
                                                                    registryID: randomID()
                                                                }
                                                                return newNode
                                                            })


                                                            console.log(parsedData.links)
                                                            parsedData.response = {
                                                                ...d.response,
                                                                name: d.name
                                                            }

                                                            let localPromises = [
                                                                new Promise(r => {
                                                                    fs.writeFile(
                                                                        newRoot + `\\Materials\\${d.name}.material`,
                                                                        JSON.stringify(parsedData),
                                                                        () => {
                                                                            r()
                                                                        });
                                                                }),
                                                                this.createRegistryEntry(d.id, newRoot.replace(this.path + '\\assets\\', '') + `\\Materials\\${d.name}.material`)
                                                            ]

                                                            parsedData.nodes.forEach((n, i) => {
                                                                localPromises.push(...this.importImage(newRoot + '\\Materials\\Resources\\' + n.name, d.response[n.sample.type], n.sample.registryID))
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
        return new Promise(r => {
            fs.writeFile(
                this.path + '\\assetsRegistry\\' + fID + `.reg`,
                JSON.stringify({
                    id: fID,
                    path: path
                }),
                () => {
                    r()
                })
        })
    }

    async readRegistryFile(id) {
        return new Promise(resolve => {
            fs.readFile(this.path + '\\assetsRegistry\\' + id + '.reg', (e, res) => {
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
                    fs.writeFile(this.path + '\\assets\\' + path, fileData, (err) => {
                        if (!previewImage)
                            resolve1()
                        else {
                            if (!fs.existsSync(this.path + '\\previews'))
                                fs.mkdirSync(this.path + '\\previews')
                            fs.writeFile(this.path + '\\previews\\' + path + '.preview', previewImage, () => {
                                resolve1()
                            })
                        }

                    })
                }),

                new Promise(resolve1 => {

                    fs.writeFile(this.path + '\\assetsRegistry\\' + fileID + '.reg', JSON.stringify({
                        id: fileID,
                        path: path
                    }), (err) => {

                        resolve1()
                    })
                })
            ]

            Promise.all(promises)
                .then(() => {
                    resolve()
                })

        })
    }

    async updateAsset(registryID, fileData, previewImage) {
        return new Promise(resolve => {
            if (!fs.existsSync(this.path + '\\assets'))
                fs.mkdir(this.path + '\\assets', () => null)
            if (!fs.existsSync(this.path + '\\preview'))
                fs.mkdir(this.path + '\\preview', () => null)
            this.readRegistryFile(registryID)
                .then(res => {
                    this.writeAsset(res.path, fileData, previewImage, registryID)
                        .then(() => resolve())
                })

        })
    }
    deleteEntity(entityID){
        return new Promise(resolve => {
            this.deleteFile(this.path + '\\logic\\' + entityID + '.entity', true)
                .then(() => resolve())
                .catch(() => resolve())
        })
    }
    async updateEntity(entity) {

        return new Promise(resolve => {
            if (!fs.existsSync(this.path + '\\logic'))
                fs.mkdir(this.path + '\\logic', () => null)
            fs.writeFile(this.path + '\\logic\\' + entity.id + '.entity', JSON.stringify(entity), (e) => {
                resolve()
            })
        })
    }

    async updateProject(meta, settings) {
        return Promise.all([
            new Promise(resolve => {
                if (meta)

                    fs.writeFile(this.path + '/.meta', JSON.stringify(meta), () => {
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

                    fs.writeFile(this.path + '/.settings', JSON.stringify(sett), () => {
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
                    file = path.resolve(dir, file);
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
            let filename = path.join(startPath, files[i]);
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
            let filename = path.join(startPath, files[i]);
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
                                    resolve1({
                                        ...JSON.parse(registryFile.toString()),
                                        registryPath
                                    })
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
        const fromResolved = path.resolve(from)

        let newRegistry = await this.readRegistry()
        console.log(fromResolved, to)
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
        const assetsResolved = path.resolve(this.path + '\\assets\\')
        const fromResolved = path.resolve(from).replace(assetsResolved, '')
        const toResolved = path.resolve(to)

        return new Promise(resolve => {
            const registryFound = registryData.find(reg => {
                const regResolved = path.resolve(this.path + '\\assets\\' + reg.path).replace(assetsResolved, '')
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
            if (!fs.existsSync(localStorage.getItem('basePath') + 'projects'))
                fs.mkdirSync(localStorage.getItem('basePath') + 'projects')

            fs.mkdir(projectPath, () => {
                fs.writeFile(projectPath + '/.meta', JSON.stringify({
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