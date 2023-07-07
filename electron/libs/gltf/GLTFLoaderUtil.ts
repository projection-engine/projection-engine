import GLTFAccessor from "./GLTFAccessor"
import GLTFBuffer from "./GLTFBuffer"
import ElectronWindowService from "../../ElectronWindowService"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "node:crypto"
import FileTypes from "../../../shared/enums/FileTypes"
import GLTFBuilderUtil from "./GLTFBuilderUtil"
import FileSystemUtil from "../FileSystemUtil"

export default class GLTFLoaderUtil {
	static glTFHierarchyNodes = new Map()
	static async load(targetDirectory, pathToFile, file) {
		try {

			const resourceRoot = GLTFLoaderUtil.#getResourceRoot(pathToFile)
			const primitives = {},
				materials = {},
				images = {},
				accessors = [],
				buffers = [],
				scene = {
					name: pathToFile.replace(".gltf", "").split(path.sep).pop(),
					entities: []
				}

			const basePath = await GLTFLoaderUtil.#createDirectories(file, targetDirectory, scene)
			await GLTFLoaderUtil.#loadAccessorsAndBuffers(file, buffers, accessors, resourceRoot)
			await GLTFLoaderUtil.#loadTextures(resourceRoot, file, images, basePath)
			await GLTFLoaderUtil.#loadPrimitives(file.meshes, primitives, materials, accessors, basePath)
			await GLTFLoaderUtil.#loadNodes(file.nodes, scene, primitives)

			const pathToAsset = basePath + path.sep + scene.name + FileTypes.COLLECTION
			await fs.promises.writeFile(pathToAsset, JSON.stringify(scene))
			await FileSystemUtil.createRegistryEntry(crypto.randomUUID(), pathToAsset.replace(ElectronWindowService.getInstance().pathToAssets, ""))
		} catch (error) {
			console.error(error)
		}
		GLTFLoaderUtil.glTFHierarchyNodes.clear()
	}

	static #getResourceRoot(pathToFile: string) {
		const resourceRoot = pathToFile.split(path.sep)
		resourceRoot.pop()
		return resourceRoot.join(path.sep)
	}

	static async #loadTextures(resourceRoot, file, images, basePath) {
		const textureMap = {}
		if (file.images)
			for (let i = 0; i < file.images.length; i++) {
				try {
					const ID = crypto.randomUUID()
					const data = file.images[i]
					textureMap[ID] = await GLTFBuilderUtil.buildImage(resourceRoot, data, ID)
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
			await FileSystemUtil.createRegistryEntry(ID, pathToAsset.replace(ElectronWindowService.getInstance().pathToAssets, ""))
		}
	}

	static async #loadPrimitives(meshes, primitives, materials, accessors, basePath) {
		for (let i = 0; i < meshes.length; i++) {
			const data = meshes[i]
			primitives[i] = []
			for (let j = 0; j < data.primitives.length; j++) {
				const primitive = data.primitives[j]
				const ID = crypto.randomUUID()
				const primitiveData = GLTFBuilderUtil.buildPrimitive(materials, data.name, j, primitive, accessors)
				const name = "mesh-" + i + "-primitive-" + j
				const pathToAsset = basePath + path.sep + "primitives" + path.sep + name + FileTypes.PRIMITIVE
				await fs.promises.writeFile(pathToAsset, JSON.stringify(primitiveData))
				await FileSystemUtil.createRegistryEntry(ID, pathToAsset.replace(ElectronWindowService.getInstance().pathToAssets, ""))
				primitives[i][j] = ID
			}
		}
	}

	static #loadNodes(nodes, scene, primitives) {
		for (let i = 0; i < nodes.length; i++) {
			try {
				const data = nodes[i]
				GLTFBuilderUtil.buildNode(i, data, scene, primitives)
			} catch (err) {
				console.error(err)
			}
		}
		for (let i = 0; i < scene.entities.length; i++) {
			const e = scene.entities[i]
			GLTFBuilderUtil.linkNodeToStructure(e)
			delete e.index
			delete e.mesh
			delete e.children
		}
	}

	static async #loadAccessorsAndBuffers(file, buffers, accessors, resourceRoot) {
		for (let i = 0; i < file.buffers.length; i++) {
			const data = file.buffers[i]

			const buffer = new GLTFBuffer(data, resourceRoot)
			await buffer.initialize()
			buffers.push(buffer)
		}

		for (let i = 0; i < file.accessors.length; i++) {
			const data = file.accessors[i]
			accessors.push(new GLTFAccessor(data, buffers, file.bufferViews))
		}
	}

	static async #createDirectories(file, targetDirectory, scene) {
		let basePath = path.resolve(targetDirectory + path.sep + scene.name)
		try {
			if (fs.existsSync(basePath))
				basePath += crypto.randomUUID()

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
		return basePath
	}
}