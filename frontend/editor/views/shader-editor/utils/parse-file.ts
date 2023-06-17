import FSFilesService from "../../../services/file-system/FSFilesService"
import FSRegistryService from "../../../services/file-system/FSRegistryService"
import ShaderEditorTools from "../libs/ShaderEditorTools"

import FileSystemUtil from "../../../../shared/lib/FileSystemUtil"
import Canvas from "../libs/Canvas"
import OpenFile from "../static/OPEN_FILE"
import ShaderComment from "../templates/ShaderComment"
import ShaderLink from "../templates/ShaderLink"

export default async function parseFile(openFile: OpenFile, canvasAPI: Canvas) {
	const res = FSRegistryService.getRegistryEntry(openFile.registryID)
	if (!res)
		return
	const dataToParse = await FSFilesService.readFile(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + res.path, "json")
	if (dataToParse && Object.keys(dataToParse).length > 0) {

		if (dataToParse.nodes)
			for (let i = 0; i < dataToParse.nodes.length; i++) {
				const node = dataToParse.nodes[i]
				const parsed = ShaderEditorTools.parseNode(node)
				if (!parsed)
					continue
				canvasAPI.addNode(parsed, true, true)
			}
		if (dataToParse.comments)
			for (let i = 0; i < dataToParse.comments.length; i++) {
				const node = dataToParse.comments[i]
				const parsed = new ShaderComment(node.x, node.y)
				parsed.color = node.color
				parsed.name = node.name
				parsed.width = node.width
				parsed.height = node.height
				canvasAPI.addComment(parsed, true, true)
			}
		if (dataToParse.links)
			for (let i = 0; i < dataToParse.links.length; i++) {
				try {
					const current = dataToParse.links[i]
					let sourceNode, targetNode
					for (let j = 0; j < canvasAPI.nodes.length; j++) {
						const n = canvasAPI.nodes[j]
						if (n.id === current.sourceNode)
							sourceNode = n
						if (n.id === current.targetNode)
							targetNode = n
						if (targetNode && sourceNode)
							break
					}
					if (!targetNode || !sourceNode)
						continue
					const targetRef = targetNode.inputs.find(i => i.key === current.targetRef)
					const sourceRef = sourceNode.output.find(i => i.key === current.sourceRef)
					const link = new ShaderLink(targetNode, sourceNode, targetRef, sourceRef)

					canvasAPI.addLink(link, true)
				} catch (err) {
					console.error(err)
				}
			}
	}

	canvasAPI.clear()
}