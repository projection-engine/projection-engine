const Node = require("./Node")
const {v4} = require("uuid")
const FILE_TYPES = require("../../../../static/FILE_TYPES")
const createDirectory = require("../utils/create-directory")
const path = require("path")
const writeData = require("../utils/write-data");
const getNormalizedName = require("../utils/get-normalized-name")

module.exports = class Scene {
    nodes = []
    scene = {}

    constructor(allNodes, scene, index) {
        this.index = index
        this.scene = scene
        for (let i in scene.nodes) {
            const n = scene.nodes[i]
            this.nodes.push({...allNodes[n], index: n})
        }
        this.allNodes = allNodes
    }

    async load(projectPath, rootPath, meshes, accessors, options, idsToLoad, fileSourcePath, materials, textures, images) {
        const partialPath = rootPath + path.sep + getNormalizedName(this.scene.name, this.index)
        const scenePath = partialPath + path.sep
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
        await writeData(
            partialPath + FILE_TYPES.SCENE,
            data,
            id,
            projectPath
        )
    }
}