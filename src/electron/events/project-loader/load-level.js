const fs = require("fs");
const {readFile} = require("../file-system/fs-essentials");
const CHANNELS = require("../../../assets/CHANNELS");
const COMPONENTS = require("../../../app/windows/project/libs/engine/data/COMPONENTS");
const loadMeshes = require("./lib/load-meshes");
const loadMaterials = require("./lib/load-materials");
const getBasePath = require("../../lib/get-base-path");
const os = require("os");
const path = require("path");
const DEFAULT = {entities: [], uiElements: []}

module.exports = async function(sender, levelPath, projectID) {
    const projectPath = getBasePath(os, path) + "projects" + path.sep + projectID
    let level
    console.log(levelPath)
    try{
        level = (fs.existsSync(levelPath) ? JSON.parse((await readFile(levelPath))[1]) : DEFAULT)
    }catch (err){
        console.error(err)
        level = DEFAULT
    }
    const entities = level.entities
    sender.send(CHANNELS.ENTITIES + projectID, level)
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
            sender.send(CHANNELS.MESH + projectID, data)
        }
    ).catch()
    loadMaterials(
        Array.from(toLoadData.materials),
        projectPath,
        (data) => sender.send(CHANNELS.MATERIAL + projectID, data)
    ).catch()

}