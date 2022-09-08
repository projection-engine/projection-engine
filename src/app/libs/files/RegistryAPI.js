import {v4 as uuidv4, v4} from "uuid";
import NodeFS from "../NodeFS";
import FilesAPI from "./FilesAPI";
import ROUTES from "../../../data/ROUTES";
import REG_PATH from "../../../data/REG_PATH"
import FilesStore from "../../windows/project/stores/FilesStore";

const {ipcRenderer} = window.require("electron")
const fs = window.require("fs")

export default class RegistryAPI {
    static registry = []

    static async readRegistry() {
        const registryPath = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + REG_PATH)
        const promise = await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once(ROUTES.READ_REGISTRY + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send(ROUTES.READ_REGISTRY, {
                pathName: registryPath,
                listenID
            })
        })

        const response = {}
        for(let i = 0; i < promise.length; i++){
            const current = promise[i]
            const pathToFind = FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + current.path)

            if(!fs.existsSync(pathToFind))
                await FilesAPI.deleteFile(current.registryPath)
            else {
                // REPEATED REGISTRY ENTRY
                console.log(response[current.path])
                if(response[current.path])
                    await FilesAPI.deleteFile(response[current.path].registryPath)
                response[current.path] = current
            }
        }
        RegistryAPI.registry = Object.values(response)
        return Object.values(response)
    }

    static async updateRegistry(from, to, registryData) {
        const assetsResolved = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets")
        const fromResolved = FilesAPI.resolvePath(from).replace(assetsResolved, "")
        const toResolved = FilesAPI.resolvePath(to)
        const registryFound = registryData.find(reg => {
            const regResolved = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + reg.path).replace(assetsResolved, "")
            return regResolved === fromResolved
        })
        if (registryFound) await NodeFS.write(registryFound.registryPath, JSON.stringify({
            id: registryFound.id, path: toResolved.replace(assetsResolved, "")
        }))
    }

    static async createRegistryEntry(fID = uuidv4(), path) {
        const pathRe = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets")
        const p = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + path).replace(pathRe, "")
        await NodeFS.write(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + REG_PATH + FilesAPI.sep + fID + ".reg"), JSON.stringify({
            id: fID, path: p
        }))
    }

    static async readRegistryFile(id) {
        try {
            return await FilesAPI.readFile(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + REG_PATH + FilesAPI.sep + id + ".reg"), "json")
        } catch (e) {
            return null
        }
    }

    static async findRegistry(p) {
        const [, res] = await NodeFS.readdir(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + REG_PATH))
        if (res) {
            const registryData = await Promise.all(res.map(data => RegistryAPI.readRegistryFile(data.replace(".reg", ""))))
            const parsedPath = FilesAPI.resolvePath(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

}