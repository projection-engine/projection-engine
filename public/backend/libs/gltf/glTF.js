import Accessor from "./instances/Accessor";
import DataBuffer from "./instances/DataBuffer";
import buildImage from "./utils/build-image";
import buildMaterial from "./utils/build-material";
import createRegistryEntry from "../../utils/create-registry-entry";
import ProjectMap from "../ProjectMap";
import buildPrimitive from "./utils/build-primitive";
import buildNode from "./utils/build-node";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import {v4} from "uuid";

/**
 * Execution order:
 * Images => Materials => Meshes ( => Primitives ) => Scenes ( => Nodes )
 */
const fs = require("fs"), path = require("path")
export default async function glTF(targetDirectory, pathToFile, file) {
    let resourceRoot = pathToFile.split(path.sep)
    resourceRoot.pop()
    resourceRoot = resourceRoot.join(path.sep)
    const primitives = {},
        materials = {},
        nodes = {},
        images = {},
        accessors = [],
        buffers = [],

        scene = {
            name: pathToFile.replace(".gltf", "").split(path.sep).pop(),
            entities: []
        }
    let basePath = path.resolve(targetDirectory + path.sep + scene.name)

    try {
        if (fs.existsSync(basePath))
            basePath += v4()

        await fs.promises.mkdir(basePath)
        if (file.images && file.images.length > 0)
            await fs.promises.mkdir(basePath + path.sep + "textures")
        if (file.meshes && file.meshes.length > 0)
            await fs.promises.mkdir(basePath + path.sep + "primitives")
        if (file.materials && file.materials.length > 0)
            await fs.promises.mkdir(basePath + path.sep + "materials")
    } catch (err) {
        console.error(err)
    }

    try {
        for (let i = 0; i < file.buffers.length; i++) {
            const data = file.buffers[i]

            const buffer = new DataBuffer(data, resourceRoot)
            await buffer.initialize()
            buffers.push(buffer)
        }

        for (let i = 0; i < file.accessors.length; i++) {
            const data = file.accessors[i]
            accessors.push(new Accessor(data, buffers, file.bufferViews))
        }

        if (file.images)
            for (let i = 0; i < file.images.length; i++) {
                try {
                    const ID = v4()
                    const data = file.images[i]
                    const texture = await buildImage(resourceRoot, data, ID)
                    const name = "texture-" + i
                    const pathToAsset = basePath + path.sep + "textures" + path.sep + name + FILE_TYPES.TEXTURE

                    await fs.promises.writeFile(pathToAsset, texture)
                    await createRegistryEntry(ID, pathToAsset.replace(ProjectMap.pathToAssets, ""))
                    images[i] = ID
                } catch (err) {
                    console.error(err)
                }
            }

        if (file.materials)
            for (let i = 0; i < file.materials.length; i++) {
                try {
                    const ID = v4()
                    const data = file.materials[i]
                    const material = await buildMaterial(file.textures, images, data)
                    const name = "material-" + i
                    const pathToAsset = basePath + path.sep + "materials" + path.sep + name + FILE_TYPES.SIMPLE_MATERIAL
                    await fs.promises.writeFile(pathToAsset, JSON.stringify(material))
                    await createRegistryEntry(ID, pathToAsset.replace(ProjectMap.pathToAssets, ""))
                    materials[i] = ID
                } catch (err) {
                    console.error(err)
                }
            }

        for (let i = 0; i < file.meshes.length; i++) {
            const data = file.meshes[i]
            primitives[i] = []
            for (let j = 0; j < data.primitives.length; j++) {
                const primitive = data.primitives[j]
                const ID = v4()
                const primitiveData = await buildPrimitive(materials, data.name, j, primitive, accessors)
                const name = "mesh-" + i + "-primitive-" + j
                const pathToAsset = basePath + path.sep + "primitives" + path.sep + name + FILE_TYPES.PRIMITIVE
                await fs.promises.writeFile(pathToAsset, JSON.stringify(primitiveData))
                await createRegistryEntry(ID, pathToAsset.replace(ProjectMap.pathToAssets, ""))
                primitives[i][j] = ID
            }
        }


        for (let i = 0; i < file.nodes.length; i++) {
            try {
                const data = file.nodes[i]
                buildNode(i, file.nodes, scene, nodes, primitives, data)
            } catch (err) {
                console.error(err)
            }
        }
        const pathToAsset = basePath + path.sep + scene.name + FILE_TYPES.COLLECTION
        await fs.promises.writeFile(pathToAsset, JSON.stringify(scene))
        await createRegistryEntry(v4(), pathToAsset.replace(ProjectMap.pathToAssets, ""))
    } catch (error) {
        console.error(error)
    }
}