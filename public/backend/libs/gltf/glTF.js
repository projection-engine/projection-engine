import createDirectory from "./utils/create-directory";
import Accessor from "./instances/Accessor";
import Scene from "./instances/Scene";


export default async function glTF(root, fileSRC, projectPath, file, options, filePath) {
    createDirectory(root)
    const idsToLoad = [], fileSourcePath = filePath.replace(fileSRC, "")
    try {
        let parsed = JSON.parse(file)
        const buffers = parsed.buffers.map(b => new Buffer(b, fileSourcePath))
        await Promise.all(buffers.map(b => b.initialize()))
        parsed.buffers = null
        const accessors = parsed.accessors.map(a => new Accessor(a, buffers, parsed.bufferViews))
        const scenes = parsed.scenes.map((s, i) => new Scene(parsed.nodes, s, i))
        await Promise.all(scenes.map(s => s.load(projectPath, root, parsed.meshes, accessors, options, idsToLoad, fileSourcePath, parsed.materials, parsed.textures, parsed.images)))
    } catch (error) {
        console.error(error)
    }

    return idsToLoad
}