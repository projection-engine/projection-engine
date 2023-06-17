import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import GizmoSystem from "../../runtime/GizmoSystem"
import Inheritance from "../Inheritance"
import gizmoTranslateEntity from "../../utils/gizmo-translate-entity"
import EngineTools from "../../EngineTools"
import StaticEditorMeshes from "../StaticEditorMeshes"
import EngineStateController from "../../../../frontend/window-editor/lib/controllers/EngineStateController"

export default class TranslationGizmo extends Inheritance {
	static gridSize = 1
	static hasCloned = false
	static cache: [number,number,number] = [0, 0, 0]

	constructor() {
		super()
		this.xyz = StaticEditorMeshes.translationGizmo
		this.xGizmo = mapGizmoMesh("x", "TRANSLATION")
		this.yGizmo = mapGizmoMesh("y", "TRANSLATION")
		this.zGizmo = mapGizmoMesh("z", "TRANSLATION")
	}

	onMouseDown(event:MouseEvent) {
		super.onMouseDown(event)
		TranslationGizmo.hasCloned = false
		TranslationGizmo.cache = [0, 0, 0]

	}

	onMouseMove(event:MouseEvent) {
		super.onMouseMove()
		if(!TranslationGizmo.hasCloned && event.shiftKey){
			const clones = EngineTools.selected.map(m => m.clone())
			EngineStateController.appendBlock(clones)

			GizmoSystem.linkEntityToGizmo(clones[0])
		}
		TranslationGizmo.hasCloned = event.shiftKey
		gizmoTranslateEntity(event)
		if(GizmoSystem.translationRef) {
			const mainEntity = GizmoSystem.mainEntity
			GizmoSystem.translationRef.textContent = `X ${mainEntity._translation[0].toFixed(2)} | Y ${mainEntity._translation[1].toFixed(2)} | Z ${mainEntity._translation[2].toFixed(2)}`
		}
	}


}
