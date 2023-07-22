import ShaderEditorTools from "../views/shader-editor/libs/ShaderEditorTools"
import SettingsStore from "../../shared/stores/SettingsStore"
import Canvas from "../views/shader-editor/libs/Canvas"
import type ShaderNode from "../views/shader-editor/templates/ShaderNode"
import ShaderComment from "../views/shader-editor/templates/ShaderComment"
import ALL_NODES from "../views/shader-editor/static/ALL_NODES"
import ContextMenuService from "../../shared/lib/context-menu/ContextMenuService"
import NODE_MAP from "../views/shader-editor/static/NODE_MAP"
import ShaderEditorUtil from "../util/ShaderEditorUtil"

export function selectAllNodes(canvasAPI:Canvas){
	let last: ShaderNode | ShaderComment
	canvasAPI.nodes.forEach(n => {
		canvasAPI.selectionMap.set(n.id, n)
		last = n
	})
	canvasAPI.comments.forEach(n => {
		canvasAPI.selectionMap.set(n.id, n)
		last = n
	})
	canvasAPI.lastSelection = last
	canvasAPI.clear()
}
export default function getShaderActions(canvasAPI: Canvas) {
	const settings = SettingsStore.getData()

	const options = {
		SELECT_ALL: {
			label: "Select all",
			require: settings.shaderEditorHotkeys.SELECT_ALL,
			callback: () => selectAllNodes(canvasAPI)
		},
		CREATE_COMMENT: {
			label: "Create comment (under selected node)",
			require: settings.shaderEditorHotkeys.CREATE_COMMENT,
			callback: () => ShaderEditorUtil.addComment(canvasAPI)
		},
		SAVE: {
			label: "Save",
			require: settings.shaderEditorHotkeys.SAVE,
			callback: () => ShaderEditorTools.save( canvasAPI).catch(console.error)
		},
		COPY: {
			label: "Copy (selected)",
			require: settings.shaderEditorHotkeys.COPY,
			callback: () => {
				const toCopy = []
				canvasAPI.selectionMap.forEach(s => toCopy.push(s))
				ShaderEditorTools.copy(toCopy)
			}
		},
		DELETE: {
			label: "Delete (selected)",
			require: settings.shaderEditorHotkeys.DELETE,
			callback: () => {
				const toRemoveFromSelection = []
				const toRemoveComments = []
				const toRemoveNodes = []
				canvasAPI.selectionMap.forEach(s => {
					toRemoveFromSelection.push(s.id)
					if (s instanceof ShaderComment)
						toRemoveComments.push(s.id)
					else {
						if(s instanceof NODE_MAP.Material)
							return
						toRemoveNodes.push(s.id)
					}
				})
				canvasAPI.removeNodes(toRemoveNodes)
				canvasAPI.removeComments(toRemoveComments)
			}
		},
		PASTE: {
			label: "Paste",

			require: settings.shaderEditorHotkeys.PASTE,
			callback: () => ShaderEditorTools.paste(canvasAPI)
		},
		UNDO: {
			label: "Undo",
			require: settings.shaderEditorHotkeys.UNDO,
			callback: () => canvasAPI.history.undo()
		},
		REDO: {
			label: "Redo",
			require: settings.shaderEditorHotkeys.REDO,
			callback: () => canvasAPI.history.redo()
		}
	}
	return {
		hotkeys: Object.values(options),
		contextMenu: [
			options.SAVE,
			{divider: true},
			options.CREATE_COMMENT,
			{divider: true},
			options.UNDO,
			options.REDO,
			{divider: true},
			options.COPY,
			options.PASTE,
			options.DELETE,
			{divider: true},
			options.SELECT_ALL,

			{
				label: "New node",
				children: ALL_NODES.map(data => ({
					...data,
					callback: () => canvasAPI.onDrop(data.dataTransfer, ContextMenuService.getInstance().currentX, ContextMenuService.getInstance().currentY)
				}))
			}
		]
	}
}