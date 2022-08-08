const {Node, getNormalizedName} = require("./Node")
const {v4} = require("uuid")
const FILE_TYPES = require("../../../../static/FILE_TYPES")
const createDirectory = require("../utils/create-directory")
const path = require("path")
module.exports = class Scene {
    nodes = []
    scene = {}

    constructor(allNodes, scene) {
        this.scene = scene
        for (let i in scene.nodes) {
            const n = scene.nodes[i]
            this.nodes.push({...allNodes[n], index: n})
        }
        this.allNodes = allNodes
    }

    async load(projectPath, rootPath, meshes, accessors, options, idsToLoad, fileSourcePath, materials, textures, images) {
        const scenePath = rootPath + path.sep + getNormalizedName(this.scene.name) + path.sep
        const nodes = this.nodes.map(n => new Node(n, this.allNodes, undefined, projectPath))
        createDirectory(scenePath)
        createDirectory(scenePath + "primitives")
        await Promise.all(nodes.map(n => n.write(scenePath + "primitives" + path.sep, meshes, accessors, options, fileSourcePath, materials, textures, images)))
        const id = v4().toString()
        const data = {
            name: this.scene.name,
            nodes: nodes.map(n => n.childNodes())
        }
        idsToLoad.push(id)
        await Node.writeData(
            rootPath + path.sep + getNormalizedName(this.scene.name) + FILE_TYPES.SCENE,
            data,
            id,
            projectPath
        )
    }
}