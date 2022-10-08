import getNormalizedName from "../../../utils/gltf/get-normalized-name";
import Node from "./Node"
import {v4} from "uuid";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import createDirectory from "../../../utils/gltf/create-directory";
import writeData from "../../../utils/gltf/write-data";

const path = require("path")

export default class Scene {
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