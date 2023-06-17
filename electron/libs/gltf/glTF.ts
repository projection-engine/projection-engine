import Accessor from "./instances/Accessor"
import DataBuffer from "./instances/DataBuffer"
import buildImage from "./utils/build-image"
import createRegistryEntry from "../../utils/create-registry-entry"
import ElectronWindowService from "../ElectronWindowService"
import buildPrimitive from "./utils/build-primitive"
import buildNode from "./utils/build-node"
import DataController from "./instances/DataController"
import linkNodeToStructure from "./utils/link-node-to-structure"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "node:crypto"
import FileTypes from "../../../shared/FileTypes";

/**
 * Execution order:
 * Images => Materials => Meshes ( => Primitives ) => Scenes ( => Nodes )
 */

export default async function glTF(targetDirectory, pathToFile, file) {

	let resourceRoot = pathToFile.split(path.sep)
	resourceRoot.pop()
	resourceRoot = resourceRoot.join(path.sep)
	const primitives = {},
		materials = {},
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
			basePath +=crypto.randomUUID()

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
		DataController.reset()
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

		const textureMap = {}
		if (file.images)
			for (let i = 0; i < file.images.length; i++) {
				try {
					const ID = crypto.randomUUID()
					const data = file.images[i]
					textureMap[ID] = await buildImage(resourceRoot, data, ID)
					images[i] = ID
				} catch (err) {
					console.error(err)
				}
			}



		const toUpdateTextures = Object.entries(textureMap)

		for (let i = 0; i < toUpdateTextures.length; i++) {
			const [ID, texture] = toUpdateTextures[i]
			const name = "texture-" + i
			const pathToAsset = basePath + path.sep + "textures" + path.sep + name + FileTypes.TEXTURE

			await fs.promises.writeFile(pathToAsset, JSON.stringify(texture))
			await createRegistryEntry(ID, pathToAsset.replace(ElectronWindowService.getInstance().pathToAssets, ""))
		}

		for (let i = 0; i < file.meshes.length; i++) {
			const data = file.meshes[i]
			primitives[i] = []
			for (let j = 0; j < data.primitives.length; j++) {
				const primitive = data.primitives[j]
				const ID = crypto.randomUUID()
				const primitiveData = await buildPrimitive(materials, data.name, j, primitive, accessors)
				const name = "mesh-" + i + "-primitive-" + j
				const pathToAsset = basePath + path.sep + "primitives" + path.sep + name + FileTypes.PRIMITIVE
				await fs.promises.writeFile(pathToAsset, JSON.stringify(primitiveData))
				await createRegistryEntry(ID, pathToAsset.replace(ElectronWindowService.getInstance().pathToAssets, ""))
				primitives[i][j] = ID
			}
		}

		for (let i = 0; i < file.nodes.length; i++) {
			try {
				const data = file.nodes[i]
				buildNode(i, data, scene, primitives)
			} catch (err) {
				console.error(err)
			}
		}
		console.error(scene)
		scene.entities.forEach(e => {
			linkNodeToStructure(e)
			delete e.index
			delete e.mesh
			delete e.children
		})

		const pathToAsset = basePath + path.sep + scene.name + FileTypes.COLLECTION
		await fs.promises.writeFile(pathToAsset, JSON.stringify(scene))
		await createRegistryEntry(crypto.randomUUID(), pathToAsset.replace(ElectronWindowService.getInstance().pathToAssets, ""))
	} catch (error) {
		console.error(error)
	}
	DataController.reset()
}