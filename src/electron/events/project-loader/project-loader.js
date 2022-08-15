const loadMeshes = require("./lib/load-meshes")
const loadMaterials = require("./lib/load-materials")
const loadEntities = require("./lib/load-entities")
const CHANNELS = require("../../../assets/CHANNELS")
const cleanUpRegistry = require("./lib/clean-up-registry")
const getBasePath = require("../../lib/get-base-path");
const DEFAULT_LEVEL = require("../../../assets/DEFAULT_LEVEL")
const os = require("os");
const path = require("path");
const COMPONENTS = require("../../../app/windows/project/libs/engine/data/COMPONENTS");
const {readFile} = require("../file-system/fs-essentials");
const fs = require("fs");

module.exports = async function loader(projectID, sender) {
    const projectPath = getBasePath(os, path) + "projects" + path.sep + projectID
    cleanUpRegistry(projectPath, projectID)
    const defaultLevelPath = projectPath + path.sep + DEFAULT_LEVEL
    let entities
    try{
        entities = (fs.existsSync(defaultLevelPath) ? JSON.parse((await readFile(defaultLevelPath))[1]) : {entities: []}).entities
    }catch (err){
        console.error(err)
        entities = []
    }

    sender.send(CHANNELS.ENTITIES + "-" + projectID, entities)
    const toLoadData = {
        meshes: new Set(),
        materials: new Set()
    }
    for (let i = 0; i < entities.length; i++) {
        const current = entities[i]

        if (!current.components || !current.components[COMPONENTS.MESH])
            continue
        toLoadData.materials.add(current.components[COMPONENTS.MESH].materialID)
        toLoadData.meshes.add(current.components[COMPONENTS.MESH].meshID)
    }

    loadMeshes(
        Array.from(toLoadData.meshes),
        projectPath,
        (data) => {
            sender.send(CHANNELS.MESH + "-" + projectID, data)
        }
    ).catch()
    loadMaterials(Array.from(toLoadData.materials), projectPath, (data) => sender.send(CHANNELS.MATERIAL + "-" + projectID, data)).catch()

}