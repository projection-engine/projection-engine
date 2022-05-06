import ImageProcessor from "../../../engine/utils/image/ImageProcessor";
import TerrainWorker from "../TerrainWorker";

import {v4 as uuidv4} from 'uuid';
import glTFImporter from "./gltf/glTFImporter";
import assimpImporter from "./fbx/assimpImporter";
import {WebWorker} from "../../../engine/utils/WebWorker";
import {lzwDecode, lzwEncode} from "./functions/lzString";

const fs = window.require('fs')
const pathRequire = window.require('path')

function resolvePath(p) {
    return pathRequire.resolve(p)
}

function fetchData() {
    self.addEventListener('message', (event) => {
        const {pathName, type} = event.data
        try {
            fetch(pathName)
                .then(t => {
                    t.text().then(data => {
                        self.postMessage({valid: true, data: type === 'json' ? JSON.parse(data) : data})
                    }).catch(e => self.postMessage({valid: false}))
                }).catch(e => self.postMessage({valid: false}))
        } catch (e) {
            self.postMessage({valid: false})
        }
    })
}

export default class FileSystem {
    constructor(projectID) {
        this.projectID = projectID
        this._path = (localStorage.getItem('basePath') + '\\projects\\' + projectID).replace(/\\\\/g, '\\')

        try {
            if (!fs.existsSync(this.path + '\\previews\\'))
                fs.mkdirSync(this.path + '\\previews\\')
            if (!fs.existsSync(this.path + '\\assets\\'))
                fs.mkdirSync(this.path + '\\assets\\')
            if (!fs.existsSync(this.path + '\\assetsRegistry\\'))
                fs.mkdirSync(this.path + '\\assetsRegistry\\')
            if (!fs.existsSync(this.path + '\\logic'))
                fs.mkdirSync(this.path + '\\logic')
        } catch (e) {
        }
    }

    get path() {
        return this._path
    }

    async createFile(pathName, content) {
        return await new Promise(resolve => fs.writeFile(this.path + '\\' + pathName, content, (e, s) => resolve(e)))
    }

    async writeFile(pathName, data) {
        return new Promise(resolve => {
            fs.writeFile(resolvePath(this.path + pathName), typeof data === 'object' ? JSON.stringify(data) : data, (e, res) => {

                resolve(e)
            })
        })
    }

    async readFile(pathName, type) {

        return new Promise(async resolve => {
            try {
                if (pathName.includes('.pimg')) {
                    const worker = new WebWorker()
                    const {data, valid} = await worker.createExecution({
                        pathName: resolvePath(pathName),
                        type
                    }, fetchData.toString())
                    resolve(data)
                } else {
                    fs.readFile(pathName, (e, res) => {
                        try {
                            let d = res.toString()
                            if (pathName.includes('.mesh'))
                                d = lzwDecode(d)
                            resolve(type === 'json' ? JSON.parse(d) : d)
                        } catch (e) {
                            resolve(null)
                        }
                    })
                }
            } catch (e) {
                resolve(null)
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
            fs.rm(currentPath, (err) => {

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

    async importFile(file, filePath, asHeightMap, options, setAlert) {
        return new Promise(async resolve => {

            const newRoot = filePath + '\\' + file.name.split(/\.([a-zA-Z0-9]+)$/)[0]
            const fileID = uuidv4()
            switch (file.name.split(/\.([a-zA-Z0-9]+)$/)[1]) {
                case 'png':
                case 'jpg':
                case 'jpeg': {
                    const res = await new Promise(re => {
                        let reader = new FileReader();
                        reader.addEventListener('load', event => {
                            re(event.target.result)
                        });
                        reader.readAsDataURL(file)
                    })

                    if (asHeightMap)
                        TerrainWorker.loadHeightMap(res, options)
                            .then(data => {
                                Promise.all([
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

                    break
                }
                case 'gltf':
                    glTFImporter(fs, resolvePath, newRoot, file, options, resolve, (v, x) => this.createRegistryEntry(v, x), this._path, (i, x, y) => this.importImage(i, x, y))
                    break
                case 'obj':
                case 'fbx':
                    const res = await assimpImporter(fs, resolvePath, newRoot, file, options, (v, x) => this.createRegistryEntry(v, x), this._path, (i, x, y) => this.importImage(i, x, y))
                    if (setAlert)
                        res.forEach(r => {
                            setAlert({
                                message: r.reason + ' - ' + r.name,
                                type: 'error'
                            })
                        })
                    resolve()
                    break
                default:
                    resolve()
                    break
            }

        })
    }

    createRegistryEntry(fID = uuidv4(), path) {

        const pathRe = resolvePath(this.path + '\\assets\\')
        const p = resolvePath(this.path + '\\assets\\' + path).replace(pathRe, '')

        return new Promise(r => {
            fs.writeFile(
                resolvePath(this.path + '\\assetsRegistry\\' + fID + `.reg`),
                JSON.stringify({
                    id: fID,
                    path: p.charAt(0) === '\\' ? p.substring(1, p.length) : p
                }),
                () => {
                    r()
                })
        })
    }

    async readRegistryFile(id) {
        try {
            return await this.readFile(resolvePath(this.path + '\\assetsRegistry\\' + id + '.reg'), 'json')
        } catch (e) {
            return null
        }
    }

    assetExists(path) {
        return fs.existsSync(resolvePath(this.path + '\\assets\\' + path))
    }

    async writeAsset(path, fileData, previewImage, registryID) {
        const fileID = registryID !== undefined ? registryID : uuidv4()
        return new Promise(resolve => {
            const promises = [
                new Promise(resolve1 => {
                    let d = fileData
                    if (path.includes('.mesh'))
                        d = lzwEncode(fileData)
                    fs.writeFile(resolvePath(this.path + '\\assets\\' + path), d, (err) => {
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

    async updateEntity(entity, id) {
        return new Promise(resolve => {
            const p = resolvePath(this.path + '\\logic\\')
            if (!p) {
                try {
                    fs.mkdirSync(p)
                } catch (err) {

                }
            }
            fs.writeFile(resolvePath(p + '\\' + id + '.entity'), entity, (e) => {
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
            const projectID = uuidv4(), projectPath = localStorage.getItem('basePath') + 'projects\\' + projectID
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

