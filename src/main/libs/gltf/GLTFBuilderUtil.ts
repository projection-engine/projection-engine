import * as path from "path"
import * as fs from "fs"
import ElectronWindowService from "../../ElectronWindowService"
import FileTypes from "../../../shared/enums/FileTypes"
import TEXTURE_TEMPLATE from "../../../renderer/engine/core/static/TEXTURE_TEMPLATE"
import sharp from "sharp"
import {mat4, quat} from "gl-matrix"
import PrimitiveProcessor from "../../../renderer/engine/core/lib/math/PrimitiveProcessor"
import GLTFLoaderUtil from "./GLTFLoaderUtil"
import FileSystemUtil from "../FileSystemUtil"

export default class GLTFBuilderUtil{
	static async buildImage(resourceRoot, image, fileID) {
		let base64
		if (image.uri.includes("data:image"))
			base64 = image.uri
		else
			base64 = `data:image/${image.uri.split(".").pop()};base64,` + await FileSystemUtil.readTypedFile(resourceRoot + path.sep + image.uri, "base64")

		const pathToPreview = path.resolve(ElectronWindowService.getInstance().pathToPreviews + path.sep + fileID + FileTypes.PREVIEW)
		const bufferPreview = await sharp(Buffer.from(base64.split(";base64,").pop(), "base64")).resize(256, 256).png().toBuffer()
		await fs.promises.writeFile(pathToPreview, "data:image/png;base64," + bufferPreview.toString("base64"))

		return {
			...TEXTURE_TEMPLATE,
			base64
		}
	}

	static linkNodeToStructure(node) {
		if (!node || !node.children)
			return
		for (let i = 0; i < node.children.length; i++) {
			const children = GLTFLoaderUtil.glTFHierarchyNodes.get(node.children[i])
			if (children) {
				children.forEach(child => child.parent = node.id)
			}
		}
	}

	static buildPrimitive(materialsMap, meshName, index, primitive, accessors) {
		const indices = GLTFBuilderUtil.#buildIndexes(primitive)

		if (!accessors[indices.vertices])
			return

		const [min, max] = PrimitiveProcessor.computeBoundingBox(accessors[indices.vertices].data)

		const normals = (indices.normals === -1 || indices.normals === undefined) ? PrimitiveProcessor.computeNormals(accessors[indices.indices]?.data, accessors[indices.vertices]?.data) : accessors[indices.normals]?.data
		const tangents = (indices.tangents === -1 || indices.tangents === undefined) ? PrimitiveProcessor.computeTangents(accessors[indices.indices]?.data, accessors[indices.vertices]?.data, accessors[indices.uvs]?.data, normals) : accessors[indices.tangents]?.data

		return {
			material: materialsMap[primitive.material],
			indices: accessors[indices.indices]?.data,
			vertices: accessors[indices.vertices]?.data,
			tangents: tangents,
			normals: normals,
			uvs: accessors[indices.uvs]?.data,
			maxBoundingBox: max,
			minBoundingBox: min,
			name: meshName + "-" + index,
			baseTransformationMatrix: Array.from(mat4.create())
		}
	}

	static #buildIndexes(data) {
		const primitive = {...data}
		primitive.attributes = Object.keys(primitive.attributes)
			.map(name => ({
				name,
				index: primitive.attributes[name]
			}))


		const vert = primitive.attributes.find(d => d.name === "POSITION")
		const norm = primitive.attributes.find(d => d.name === "NORMAL")
		const tang = primitive.attributes.find(d => d.name === "TANGENT")
		const uv = primitive.attributes.find(d => d.name === "TEXCOORD_0")

		return {
			indices: primitive.indices,
			vertices: vert ? vert.index : -1,
			tangents: tang ? tang.index : -1,
			normals: norm ? norm.index : -1,
			uvs: uv ? uv.index : -1,
			material: primitive.material
		}

	}

	static buildNode(index, node, sceneMap, primitivesMap) {
		if (!node.children && node.mesh === undefined)
			return
		const parsedNode = <MutableObject>{
			id: crypto.randomUUID(),
			children: node.children,
			mesh: node.mesh,
			index,
			name: node.name,
			baseTransformationMatrix: []
		}

		if (node.matrix)
			parsedNode.baseTransformationMatrix = node.matrix
		else
			mat4.fromRotationTranslationScale(
				parsedNode.baseTransformationMatrix,
				quat.normalize([0,0,0,0], node.rotation || [0, 0, 0, 1]),
				node.translation || [0, 0, 0],
				node.scale || [1, 1, 1]
			)
		parsedNode.baseTransformationMatrix = Array.from(parsedNode.baseTransformationMatrix)

		sceneMap.entities.push(parsedNode)
		!GLTFLoaderUtil.glTFHierarchyNodes.get(parsedNode.index) && GLTFLoaderUtil.glTFHierarchyNodes.set(parsedNode.index, [])
		const m = GLTFLoaderUtil.glTFHierarchyNodes.get(parsedNode.index)
		m.push(parsedNode)
		if (parsedNode.mesh !== undefined) {
			const primitives = primitivesMap[parsedNode.mesh]
			for (let i = 0; i < primitives.length; i++) {
				const primitiveID = primitives[i]
				if (!primitiveID)
					continue
				if (i > 1) {
					const clone = <MutableObject>{...parsedNode}
					clone.id = crypto.randomUUID()
					clone.meshID = primitiveID
					sceneMap.entities.push(clone)
					m.push(clone)
				} else
					parsedNode.meshID = primitiveID
			}
		}
	}

}