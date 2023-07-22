import AssimpJS from "./Assimp.js"
import PrimitiveProcessor from "../../../renderer/engine/core/lib/math/PrimitiveProcessor"
import ElectronWindowService from "../../ElectronWindowService"

import {mat4} from "gl-matrix"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "node:crypto"
import FileTypes from "../../../shared/enums/FileTypes"
import AbstractSingleton from "../../../shared/AbstractSingleton"
import FileSystemUtil from "../FileSystemUtil"

const CACHE_MATRIX = new Float32Array(16)

interface NodeType {
    meshes: string[] | undefined,
    transformation: number[],
    children: undefined | NodeType[],
    name: string
}

interface GLTFType {
    meshes: undefined | MutableObject[],
    rootnode: NodeType | undefined
}

export default class AssimpService extends AbstractSingleton {
	private instance

	constructor() {
		super()
		// @ts-ignore
		const instancePromise = AssimpJS()
		instancePromise.then(res => {
			this.instance = res
		})
	}

	static getInstance(): AssimpService {
		return super.get<AssimpService>()
	}

	async load(pathToDir: string, filePath: string) {
		if (!this.instance)
			return
		const dir = path.resolve(pathToDir)
		if (!fs.existsSync(dir))
			fs.mkdirSync(dir)

		const buffer = await fs.promises.readFile(filePath)
		await this.#load(dir, filePath, buffer)
	}

	async #load(dir, file, bufferData): Promise<void> {
		try {
			const collectionDirectory = file.split(path.sep).pop().split(".").shift()
			const ajs = this.instance

			const fileList = new ajs.FileList()
			const buffer = new Uint8Array(bufferData)
			fileList.AddFile(
				file.split(path.sep).pop(),
				buffer
			)
			const result = ajs.ConvertFileList(fileList, "assjson")
			if (!result.IsSuccess() || result.FileCount() === 0) {
				console.error(result.GetErrorCode())
				return
			}

			if (!fs.existsSync(dir))
				fs.mkdirSync(dir)
			if (!fs.existsSync(dir + path.sep + collectionDirectory))
				fs.mkdirSync(dir + path.sep + collectionDirectory)

			const meshes: {} = {}
			const data = <GLTFType | undefined>JSON.parse(new TextDecoder().decode(result.GetFile(0).GetContent()))
			const collection = {
				name: collectionDirectory,
				entities: []
			}

			if (!data?.meshes)
				return
			for (let m = 0; m < data.meshes.length; m++)
				await this.#createMesh(dir, meshes, m, data.meshes, collectionDirectory)
			if (data.rootnode)
				this.#mapChildren(collection.entities, meshes, data.rootnode)

			const collectionPath = path.resolve(dir + path.sep + collectionDirectory + path.sep + collectionDirectory + FileTypes.COLLECTION)
			await fs.promises.writeFile(
				collectionPath,
				JSON.stringify(collection)
			)
			await FileSystemUtil.createRegistryEntry(crypto.randomUUID(), collectionPath.replace(ElectronWindowService.getInstance().pathToAssets, ""))
		} catch (err) {
			console.error(err)
		}
	}
 
	async #createMesh(dir, meshes, index, data, collectionName): Promise<void> {
		const PRIMITIVE_PATH = path.resolve(dir + path.sep + collectionName + path.sep + "primitives")
		const mesh = data[index]
		const meshID = crypto.randomUUID()
		meshes[index] = meshID

		const indices = mesh.faces.flat(), uvs = mesh.texturecoords[0]
		const b = PrimitiveProcessor.computeBoundingBox(mesh.vertices)
		const jsonText = JSON.stringify({
			indices,
			vertices: mesh.vertices,
			tangents: mesh.tangents ? mesh.tangents : PrimitiveProcessor.computeTangents(indices.flat(), mesh.vertices, uvs, mesh.normals),
			normals: mesh.normals ? mesh.normals : PrimitiveProcessor.computeNormals(indices, mesh.vertices),
			uvs,
			maxBoundingBox: b[1] ? b[1] : [0, 0, 0],
			minBoundingBox: b[0] ? b[0] : [0, 0, 0],
			name: mesh.name
		})
		try {
			if (!fs.existsSync(PRIMITIVE_PATH))
				fs.mkdirSync(PRIMITIVE_PATH)
			const localName = PRIMITIVE_PATH + path.sep + mesh.name + FileTypes.PRIMITIVE
			await fs.promises.writeFile(
				path.resolve(localName),
				jsonText
			)
			await FileSystemUtil.createRegistryEntry(meshID, localName.replace(ElectronWindowService.getInstance().pathToAssets, ""))
		} catch (err) {
			console.error(err)
		}
	}

	#mapChildren(collection, meshes: MutableObject, node: NodeType, parent?: string): undefined {
		if (!node)
			return
		const nodeID = crypto.randomUUID()
		const {transformation, children, name} = node

		// @ts-ignore
		mat4.transpose(CACHE_MATRIX, transformation)


		const baseTransformationMatrix = Array.from(CACHE_MATRIX)
		if (node.meshes)
			for (let i = 0; i < node.meshes.length; i++) {
				const meshID = meshes[node.meshes[i]]
				if (meshID == null)
					continue
				collection.push({
					id: nodeID,
					meshID,
					baseTransformationMatrix,
					name: name + "-" + i,
					parent
				})
			}
		else
			collection.push({
				id: nodeID,
				baseTransformationMatrix,
				name,
				parent
			})

		if (!children)
			return
		for (let i = 0; i < children.length; i++) {
			const child = children[i]
			this.#mapChildren(collection, meshes, child, nodeID)
		}
	}
}