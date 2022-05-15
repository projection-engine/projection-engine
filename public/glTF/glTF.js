import Buffer from "./instances/Buffer";
import Accessor from "./instances/Accessor";
import PrimitiveProcessor from "./instances/PrimitiveProcessor";
import groupInto from "./utils/groupInto";
import parseNode from "./utils/parseNode";
import getPrimitives from "./utils/getPrimitive";
import parseMaterial from "./utils/parseMaterial";
import Scene from "./instances/Scene";


const fs = require('fs')
const path = require('path')
export function createDirectory(p){
    try {
        fs.mkdirSync(path.resolve(p))
    } catch (e) {
        console.log(e)
    }
}
export default async function glTF(root, fileSRC, projectPath, file, options) {
    createDirectory(root)
    try {
        let parsed = JSON.parse(file)
        const buffers = parsed.buffers.map(b => new Buffer(b, fileSRC))
        await Promise.all(buffers.map(b => b.initialize()))
        parsed.buffers = null
        const accessors = parsed.accessors.map(a => new Accessor(a, buffers, parsed.bufferViews))
        const scenes = parsed.scenes.map(s => new Scene(parsed.nodes, s))
        await Promise.all(scenes.map(s => s.load(projectPath, root, parsed.meshes, accessors, options)))
    } catch (error) {
        console.log(error)
    }
}