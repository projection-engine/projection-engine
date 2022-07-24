const COMPONENTS = {} // TODO - REQUIRE
const loadMeshes = require("./lib/load-meshes")
const loadMaterials = require("./lib/load-materials")
const loadData = require("./lib/load-meta-data")
const CHANNELS = require("../../static/CHANNELS")
const cleanUpRegistry = require("./lib/clean-up-registry")
const getBasePath = require("../../lib/get-base-path");
const os = require("os");
const path = require("path");

module.exports = async function loader(projectID, sender) {
    const projectPath = getBasePath(os, path) +"projects" + path.sep + projectID
    cleanUpRegistry(projectPath, projectID)
    const {settings, meta, entities} = await loadData(projectPath)
    sender.send(CHANNELS.META_DATA + "-" + projectID, {
        meta, settings, entities
    })
    const toLoadData = {
        meshes: new Set(),
        materials: new Set()
    }
    for (let i = 0; i < entities.length; i++) {
        const {data: current} = entities[i]

        if (!current.components || !current.components[COMPONENTS.MESH])
            continue
        toLoadData.materials.add(current.components[COMPONENTS.MESH].materialID)
        toLoadData.meshes.add(current.components[COMPONENTS.MESH].meshID)
    }

    loadMeshes(Array.from(toLoadData.meshes), projectPath, (data) => sender.send(CHANNELS.MESH + "-" + projectID, data)).catch()
    loadMaterials(Array.from(toLoadData.materials), projectPath, (data) => sender.send(CHANNELS.MATERIAL + "-" + projectID, data)).catch()

}