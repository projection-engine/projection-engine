import GizmoSystem from "../GizmoSystem"
import EngineTools from "../../EngineTools"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import EngineStateService from "../../../../frontend/editor/services/engine/EngineStateService"
import {mat4, vec3, vec4} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"
import ScreenSpaceGizmo from "./ScreenSpaceGizmo"
import GizmoState from "../util/GizmoState"
import EditorActionHistory from "../../../../frontend/editor/services/EditorActionHistory"
import GizmoMouseUtil from "../util/GizmoMouseUtil"
import AXIS from "../../static/AXIS"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import IGizmo from "../IGizmo"
import Mesh from "../../../core/instances/Mesh"
import Entity from "../../../core/instances/Entity"

export default class TranslationGizmo extends AbstractSingleton implements IGizmo {
	#hasCloned = false
	#cache: [number,number,number] = [0, 0, 0]

	mesh: Mesh
	xGizmo: Entity
	yGizmo: Entity
	zGizmo: Entity

	constructor() {
		super()
		this.mesh = StaticEditorMeshes.translationGizmo
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

	drawToDepth(data) {
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.xGizmo.matrix, this.xGizmo.pickID)
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.yGizmo.matrix, this.yGizmo.pickID)
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.zGizmo.matrix, this.zGizmo.pickID)
	}

	transformGizmo() {
		mat4.copy(this.xGizmo.matrix, this.xGizmo.__cacheMatrix)
		mat4.copy(this.yGizmo.matrix, this.yGizmo.__cacheMatrix)
		mat4.copy(this.zGizmo.matrix, this.zGizmo.__cacheMatrix)

		GizmoUtil.translateMatrix(this.xGizmo)
		GizmoUtil.translateMatrix(this.yGizmo)
		GizmoUtil.translateMatrix(this.zGizmo)
	}
	clearState(){
		this.#cache.fill(0)
		this.#hasCloned = false
	}

	drawGizmo() {
		if (!GizmoState.mainEntity)
			return

		GizmoUtil.drawGizmo(this.mesh, this.xGizmo.matrix, AXIS.X)
		GizmoUtil.drawGizmo(this.mesh, this.yGizmo.matrix, AXIS.Y)
		GizmoUtil.drawGizmo(this.mesh, this.zGizmo.matrix, AXIS.Z)
	}


	onMouseMove(event:MouseEvent) {
		if (!GizmoState.hasTransformationStarted) {
			GizmoState.hasTransformationStarted = true
			EditorActionHistory.save(EngineTools.selected)
			GizmoSystem.updateGizmoToolTip()
		}
		if(!this.#hasCloned && event.shiftKey){
			const clones = EngineTools.selected.map(m => m.clone())
			EngineStateService.appendBlock(clones)
			GizmoState.mainEntity = clones[0]
		}
		this.#hasCloned = event.shiftKey
		this.#gizmoTranslateEntity(event)
		if(GizmoSystem.translationRef) {
			const mainEntity = GizmoState.mainEntity
			GizmoSystem.translationRef.textContent = `X ${mainEntity._translation[0].toFixed(2)} | Y ${mainEntity._translation[1].toFixed(2)} | Z ${mainEntity._translation[2].toFixed(2)}`
		}
	}

	#gizmoTranslateEntity(event) {
		const CACHE = vec4.create()
		const firstEntity = GizmoState.mainEntity
		const LOCAL_CACHE = this.#cache
		if (!firstEntity)
			return
		const g = event.ctrlKey ? 1 : GizmoState.translationGridSize
		const vec = ScreenSpaceGizmo.onMouseMove(event)

		if (GizmoState.isGlobal)
			vec3.copy(<vec3>CACHE, vec)
		else
			vec4.transformQuat(CACHE, [vec[0], vec[1], vec[2], 1], firstEntity.rotationQuaternionFinal)


		vec3.add(LOCAL_CACHE, LOCAL_CACHE, <vec3>CACHE)
		if (Math.abs(LOCAL_CACHE[0]) >= g || Math.abs(LOCAL_CACHE[1]) >= g || Math.abs(this.#cache[2]) >= g) {
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
