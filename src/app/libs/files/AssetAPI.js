import NodeFS from "../NodeFS";
import {v4 as uuidv4} from "uuid";
import RegistryAPI from "./RegistryAPI";
import FilesAPI from "./FilesAPI";

export default class AssetAPI {

    static async assetExists(path) {
        return await NodeFS.exists(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + path))
    }

    static async writeAsset(path, fileData, previewImage, registryID) {
        const fileID = registryID !== undefined ? registryID : uuidv4()
        await NodeFS.write(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + path), fileData)
        if (previewImage)
            await NodeFS.write(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "previews" + FilesAPI.sep + registryID + ".preview"), previewImage)
        await RegistryAPI.createRegistryEntry(fileID, path)
    }


    static async updateAsset(registryID, fileData, previewImage) {
        const res = await RegistryAPI.readRegistryFile(registryID)
        if (res)
            await AssetAPI.writeAsset(res.path, fileData, previewImage, registryID)
        else
            throw Error("Not found")
    }



    static async updateEntity(entity, id) {

        const p = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "logic")
        await NodeFS.write(FilesAPI.resolvePath(p + FilesAPI.sep + id + ".entity"), entity)
    }

    static async updateProject(meta, settings) {
        if (meta) await NodeFS.write(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + ".meta"), JSON.stringify(meta))
        if (settings) {
            let sett = {...settings}
            delete sett.type
            delete sett.data
            await NodeFS.write(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + ".settings"), JSON.stringify(sett))
        }
    }

    static async createProject(name) {

        const projectID = uuidv4(),
            projectPath = localStorage.getItem("basePath") + "projects" + FilesAPI.sep + projectID
        if (!(await NodeFS.exists(FilesAPI.resolvePath(localStorage.getItem("basePath") + "projects")))) await NodeFS.mkdir(FilesAPI.resolvePath(localStorage.getItem("basePath") + "projects"))
        const [err] = await NodeFS.mkdir(projectPath)
        if (!err) {
            await NodeFS.write(FilesAPI.resolvePath(projectPath + FilesAPI.sep + ".meta"), JSON.stringify({
                id: projectID, name: name, creationDate: new Date().toDateString()
            }))
        }
        return projectID
    }


}