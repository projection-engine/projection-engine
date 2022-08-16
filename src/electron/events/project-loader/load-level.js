const fs = require("fs");
const {readFile} = require("../file-system/fs-essentials");
const CHANNELS = require("../../../assets/CHANNELS");
const COMPONENTS = require("../../../app/windows/project/libs/engine/data/COMPONENTS");
const loadMeshes = require("./lib/load-meshes");
const loadMaterials = require("./lib/load-materials");
const getBasePath = require("../../lib/get-base-path");
const os = require("os");
const path = require("path");

module.exports = async function(sender, levelPath, projectID) {
    const projectPath = getBasePath(os, path) + "projects" + path.sep + projectID
    let entities
    console.log(levelPath)
    try{
        entities = (fs.existsSync(levelPath) ? JSON.parse((await readFile(levelPath))[1]) : {entities: []}).entities
    }catch (err){
        console.error(err)
        entities = []
    }

    sender.send(CHANNELS.ENTITIES + projectID, entities)
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