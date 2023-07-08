import GizmoSystem from "../GizmoSystem"
import Inheritance from "../Inheritance"
import EngineTools from "../../EngineTools"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import EngineStateService from "../../../../frontend/editor/services/engine/EngineStateService"
import {vec3, vec4} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"
import ScreenSpaceGizmo from "./ScreenSpaceGizmo"
import GizmoAPI from "../util/GizmoAPI"

export default class TranslationGizmo extends Inheritance {
	static gridSize = 1
	static hasCloned = false
	static cache: [number,number,number] = [0, 0, 0]

	constructor() {
		super()
		this.xyz = StaticEditorMeshes.translationGizmo
		this.xGizmo =TranslationGizmo.#mapGizmoMesh("x", 2)
		this.yGizmo =TranslationGizmo.#mapGizmoMesh("y", 3)
		this.zGizmo =TranslationGizmo.#mapGizmoMesh("z", 4)
	}
	static #mapGizmoMesh(axis: string, index:number){
		const rotation = vec3.create()
		const scale = vec3.fromValues(.75, 0.05, 0.05)
		switch (axis) {
		case "y":
			vec3.copy(rotation, [0, 0, Math.PI/2])
			break
		case "z":
			vec3.copy(rotation, [Math.PI, -Math.PI/2, Math.PI])
			break
		}
		return GizmoUtil.getGizmoEntity(index, rotation, scale)
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
			EngineStateService.appendBlock(clones)

			GizmoSystem.linkEntityToGizmo(clones[0])
		}
		TranslationGizmo.hasCloned = event.shiftKey
		TranslationGizmo.#gizmoTranslateEntity(event)
		if(GizmoSystem.translationRef) {
			const mainEntity = GizmoSystem.mainEntity
			GizmoSystem.translationRef.textContent = `X ${mainEntity._translation[0].toFixed(2)} | Y ${mainEntity._translation[1].toFixed(2)} | Z ${mainEntity._translation[2].toFixed(2)}`
		}
	}

	static #gizmoTranslateEntity(event) {
		const CACHE = vec4.create()
		const firstEntity = GizmoSystem.mainEntity
		const LOCAL_CACHE = TranslationGizmo.cache
		if (!firstEntity)
			return
		const g = event.ctrlKey ? 1 : TranslationGizmo.gridSize
		const vec = ScreenSpaceGizmo.onMouseMove(event)

		if (GizmoAPI.isGlobal)
			vec3.copy(<vec3>CACHE, vec)
		else
			vec4.transformQuat(CACHE, [vec[0], vec[1], vec[2], 1], firstEntity.rotationQuaternionFinal)


		vec3.add(LOCAL_CACHE, LOCAL_CACHE, <vec3>CACHE)
		if (Math.abs(LOCAL_CACHE[0]) >= g || Math.abs(LOCAL_CACHE[1]) >= g || Math.abs(TranslationGizmo.cache[2]) >= g) {
			const entities = EngineTools.selected
			const SIZE = entities.length
			if (SIZE === 1 && entities[0].lockedTranslation)
				return
			for (let i = 0; i < SIZE; i++) {
				const target = entities[i]
				if (target.lockedTranslation)
					continue
				if (SIZE === 1 && event.altKey) {
					vec3.add(target.pivotPoint, target.pivotPoint, LOCAL_CACHE)
					target.__pivotChanged = true
					continue
				}
				vec3.add(target._translation, target._translation, LOCAL_CACHE)
				target.__changedBuffer[0] = 1
			}
			LOCAL_CACHE.fill(0)
		}
	}


}
