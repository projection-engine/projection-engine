import glTFNode, {getNormalizedName} from "./glTFNode";
import {v4} from "uuid";
import FILE_TYPES from "../FILE_TYPES";
import {createDirectory} from "../glTF";

const path = require('path')
export default class Scene {
    nodes = []
    scene = {}

    constructor(allNodes, scene) {
        this.scene = scene
        this.nodes = allNodes
            .map((n, index) => {
                if (scene.nodes.includes(index))
                    return {...allNodes[index], index}
                else
                    return undefined
            })
            .filter(e => e !== undefined)
    }

    async load(projectPath, rootPath, meshes, accessors, options) {
        const scenePath = rootPath + path.sep + getNormalizedName(this.scene.name) +  path.sep
        const nodes = this.nodes.map(n => new glTFNode(n, this.nodes, undefined, projectPath))
        createDirectory(scenePath)
        await Promise.all(nodes.map(n => n.write(scenePath, meshes, accessors, options)))
        await glTFNode.writeData(
            scenePath +  getNormalizedName(this.scene.name) + FILE_TYPES.SCENE,
            {
                name: this.scene.name,
                nodes: nodes.map(n => n.childNodes())
            },
            v4().toString(),
            projectPath
        )
    }
}