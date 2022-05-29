import  {getNormalizedName} from "./Node";
import {v4} from "uuid";
import FILE_TYPES from "../FILE_TYPES";
import {createDirectory} from "../glTF";
import Node from "./Node";

const path = require('path')
export default class Scene {
    nodes = []
    scene = {}

    constructor(allNodes, scene) {
        this.scene = scene
        for(let i in scene.nodes){
            const n = scene.nodes[i]
            this.nodes.push({...allNodes[n], index: n})
        }
        this.allNodes = allNodes
    }

    async load(projectPath, rootPath, meshes, accessors, options) {
        const scenePath = rootPath + path.sep + getNormalizedName(this.scene.name) + path.sep
        const nodes = this.nodes.map(n => new Node(n, this.allNodes, undefined, projectPath))
        createDirectory(scenePath)
        createDirectory(scenePath + 'primitives')
        await Promise.all(nodes.map(n => n.write(scenePath + 'primitives' + path.sep, meshes, accessors, options)))
        await Node.writeData(
            rootPath + path.sep  +  getNormalizedName(this.scene.name) + FILE_TYPES.SCENE,
            {
                name: this.scene.name,
                nodes: nodes.map(n => n.childNodes())
            },
            v4().toString(),
            projectPath
        )
    }
}