import ImageProcessor from "../../engine/utils/image/ImageProcessor";
import {v4, v4 as uuidv4} from 'uuid';
import AsyncFS from "../../../components/AsyncFS";

const pathRequire = window.require('path')
function resolvePath(p) {
    return pathRequire.resolve(p)
}
const {ipcRenderer} = window.require('electron')
export default class FileSystem {
    constructor(projectID) {
        this.projectID = projectID
        this._path = (localStorage.getItem('basePath') + '\\projects\\' + projectID).replace(/\\\\/g, '\\')

        new Promise(async resolve => {
            if (!await AsyncFS.exists(this.path + '\\previews\\')) await AsyncFS.mkdir(this.path + '\\previews\\')
            if (!await AsyncFS.exists(this.path + '\\assets\\')) await AsyncFS.mkdir(this.path + '\\assets\\')
            if (!await AsyncFS.exists(this.path + '\\assetsRegistry\\')) await AsyncFS.mkdir(this.path + '\\assetsRegistry\\')
            if (!await AsyncFS.exists(this.path + '\\logic')) await AsyncFS.mkdir(this.path + '\\logic')

            resolve()
        }).catch(err => console.error(err))
    }

    get path() {
        return this._path
    }

    async writeFile(pathName, data) {
        return await AsyncFS.write(resolvePath(this.path + pathName), typeof data === 'object' ? JSON.stringify(data) : data)
    }

    async readFile(pathName, type) {
        return await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once('read-file-' + listenID, (ev, data) => resolve(data))
            ipcRenderer.send('read-file', {pathName, type, listenID})
        })
    }

    async findRegistry(p) {
        const [e, res] = await AsyncFS.readdir(resolvePath(this.path + '\\assetsRegistry'))
        if (res) {
            const registryData = await Promise.all(res.map(data => this.readRegistryFile(data.replace('.reg', ''))))
            const parsedPath = pathRequire.resolve(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

    async deleteFile(pathName, absolute, options) {
        const currentPath = absolute ? pathName : (this._path + pathName)
        await AsyncFS.rm(currentPath, options)
        const rs = await this.findRegistry(currentPath)
        if (rs) await AsyncFS.rm(resolvePath(this.path + '\\assetsRegistry\\' + rs.id + '.reg'))
    }

    async importImage(newRoot, res, fileID) {
        if (res && !(await AsyncFS.exists(newRoot + `.pimg`))) {

            await AsyncFS.write(newRoot + `.pimg`, res)
            const reduced = await ImageProcessor.resizeImage(res, 256, 256)
            await AsyncFS.write(resolvePath(this.path + '\\previews\\' + fileID + `.preview`), reduced)
            await this.createRegistryEntry(fileID, newRoot.replace(this.path + '\\assets\\', '') + `.pimg`)
        }
    }

    async openDialog() {
        return await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once('dialog-response-' + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send('open-file-dialog', {listenID})
        })
    }

    async importFile(options, targetDir, filesToLoad) {
        for (let i in filesToLoad) {
            const filePath = filesToLoad[i]
            const name = filePath.split(pathRequire.sep).pop()

            const newRoot = targetDir + pathRequire.sep + name.split('.')[0]
            const fileID = uuidv4()
            const type = filePath.split(/\.([a-zA-Z0-9]+)$/)[1]
            switch (type) {
                case 'png':
                case 'jpg':
                case 'jpeg': {
                    const file = await this.readFile(filePath, 'buffer')
                    await this.importImage(newRoot, `data:image/${type};base64,` + new Buffer(file).toString('base64'), fileID)
                    break
                }
                case 'gltf':
                    await new Promise(resolve => {
                        const listenID = v4().toString()
                        ipcRenderer.once('import-gltf-' + listenID, (ev, data) => {
                            resolve(data)
                            console.log(data, 'HERE')
                        })

                        ipcRenderer.send('import-gltf', {
                            filePath: filePath,
                            newRoot,
                            options,
                            projectPath: this.path,
                            listenID,
                            fileName: filePath.split(pathRequire.sep).pop()
                        })
                    })
                    break
                default:
                    break
            }
        }
    }

    async createRegistryEntry(fID = uuidv4(), path) {
        const pathRe = resolvePath(this.path + '\\assets\\')
        const p = resolvePath(this.path + '\\assets\\' + path).replace(pathRe, '')
        await AsyncFS.write(resolvePath(this.path + '\\assetsRegistry\\' + fID + `.reg`), JSON.stringify({
            id: fID, path: p.charAt(0) === '\\' ? p.substring(1, p.length) : p
        }))
    }

    async readRegistryFile(id) {
        try {
            return await this.readFile(resolvePath(this.path + '\\assetsRegistry\\' + id + '.reg'), 'json')
        } catch (e) {
            return null
        }
    }

    async assetExists(path) {
        return await AsyncFS.exists(resolvePath(this.path + '\\assets\\' + path))
    }

    async writeAsset(path, fileData, previewImage, registryID) {
        const fileID = registryID !== undefined ? registryID : uuidv4()
        return new Promise(async resolve => {
            await new Promise(async resolve1 => {
                await AsyncFS.write(resolvePath(this.path + '\\assets\\' + path), fileData)
                if (!previewImage) {
                    resolve1()
                } else {
                    await AsyncFS.write(resolvePath(this.path + '\\previews\\' + registryID + '.preview'), previewImage)
                    resolve1()
                }
            })
            await this.createRegistryEntry(fileID, path)
            resolve()
        })
    }


    async updateAsset(registryID, fileData, previewImage) {
        const res = await this.readRegistryFile(registryID)
        await this.writeAsset(res.path, fileData, previewImage, registryID)
    }

    async deleteEntity(entityID) {
        await this.deleteFile(this.path + '\\logic\\' + entityID + '.entity', true)
    }

    async updateEntity(entity, id) {
        const p = resolvePath(this.path + '\\logic\\')
        await AsyncFS.write(resolvePath(p + '\\' + id + '.entity'), entity)
    }

    async updateProject(meta, settings) {
        if (meta) await AsyncFS.write(resolvePath(this.path + '\\.meta'), JSON.stringify(meta))
        if (settings) {
            let sett = {...settings}
            delete sett.type
            delete sett.data
            await AsyncFS.write(resolvePath(this.path + '\\.settings'), JSON.stringify(sett))
        }
    }

    async dirStructure(dir) {
        let results = [];
        if ((await AsyncFS.exists(dir))) {
            const [err, list] = await AsyncFS.readdir(dir)
            if (err) return [];
            let pending = list.length;
            if (!pending) return results;
            for (let i in list) {
                let file = pathRequire.resolve(dir, list[i]);
                const [err, stat] = await AsyncFS.stat(file)
                results.push(file);
                if (stat && stat.isDirectory) {
                    const res = await this.dirStructure(file)
                    results = results.concat(res)
                    if (!--pending) return results
                } else if (!--pending) return results
            }
        }
        return []
    }

    async fromDirectory(startPath, extension) {
        if (!(await AsyncFS.exists(startPath))) return []
        let res = []
        let files = (await AsyncFS.readdir(startPath))[1];
        for (let i = 0; i < files.length; i++) {
            const filename = pathRequire.join(startPath, files[i]);
            const stat = (await AsyncFS.lstat(filename))[1];
            if (stat.isDirectory) res.push(...(await this.fromDirectory(filename, extension)))
            else if (filename.indexOf(extension) >= 0) res.push(files[i])
        }
        return res
    }

    async foldersFromDirectory(startPath) {
        if (!(await AsyncFS.exists(startPath))) return []
        let res = []
        let files = (await AsyncFS.readdir(startPath))[1];
        for (let i = 0; i < files.length; i++) {
            const filename = pathRequire.join(startPath, files[i]);
            const stat = (await AsyncFS.lstat(filename))[1];
            if (stat.isDirectory) res.push(filename)
        }
        return res
    }

    async rename(from, to) {
        const fromResolved = pathRequire.resolve(from)
        let newRegistry = await this.readRegistry()
        return new Promise(async rootResolve => {
            const stat = (await AsyncFS.lstat(fromResolved))[1]
            if (stat !== undefined && stat.isDirectory) {
                await AsyncFS.mkdir(to)
                const [error, res] = AsyncFS.readdir(fromResolved)
                if (res) {

                    for (let i in res) {
                        const file = res[i]
                        const oldPath = fromResolved + `/${file}`
                        const newPath = to + `/${file}`;
                        if ((await AsyncFS.lstat(oldPath))[1].isDirectory) await this.rename(oldPath, newPath)
                        else {
                            await AsyncFS.rename(oldPath, newPath)
                            await this.updateRegistry(oldPath, newPath, newRegistry)
                        }
                    }
                    await AsyncFS.rm(fromResolved, {recursive: true, force: true})
                    rootResolve()
                } else rootResolve(error)
            } else if (stat !== undefined) {
                await AsyncFS.rename(fromResolved, to)
                await this.updateRegistry(from, to, newRegistry)
                rootResolve()
            } else rootResolve()
        })

    }


    readRegistry() {
        return new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once('read-registry-' + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send('read-registry', {pathName: this.path + '\\assetsRegistry\\', listenID})
        })

    }

    async updateRegistry(from, to, registryData) {
        const assetsResolved = pathRequire.resolve(this.path + '\\assets\\')
        const fromResolved = pathRequire.resolve(from).replace(assetsResolved, '')
        const toResolved = pathRequire.resolve(to)
        const registryFound = registryData.find(reg => {
            const regResolved = pathRequire.resolve(this.path + '\\assets\\' + reg.path).replace(assetsResolved, '')
            return regResolved === fromResolved
        })
        if (registryFound) await AsyncFS.write(registryFound.registryPath, JSON.stringify({
            id: registryFound.id, path: toResolved.replace(assetsResolved, '')
        }))
    }

    static async createProject(name) {

        const projectID = uuidv4(), projectPath = localStorage.getItem('basePath') + 'projects\\' + projectID
        if (!(await AsyncFS.exists(resolvePath(localStorage.getItem('basePath') + 'projects')))) await AsyncFS.mkdir(resolvePath(localStorage.getItem('basePath') + 'projects'))
        await AsyncFS.mkdir(projectPath)
        await AsyncFS.write(resolvePath(projectPath + '/.meta'), JSON.stringify({
            id: projectID, name: name, creationDate: new Date().toDateString()
        }))
        return projectID
    }
}


