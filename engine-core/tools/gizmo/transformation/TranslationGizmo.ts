import EngineTools from "../../EngineTools"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import EngineStateService from "../../../../frontend/editor/services/engine/EngineStateService"
import {vec3, vec4} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"
import GizmoState from "../util/GizmoState"
import GizmoMouseUtil from "../util/GizmoMouseUtil"
import AXIS from "../../static/AXIS"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import IGizmo from "../IGizmo"
import Mesh from "../../../core/instances/Mesh"
import Entity from "../../../core/instances/Entity"
import GizmoSystem from "../GizmoSystem"

export default class TranslationGizmo extends AbstractSingleton implements IGizmo {
	#hasCloned = false
	#transformationIncrement =  vec3.create()
	#transformationIncrement1 =  vec4.create()
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
		GizmoUtil.translateMatrix(this.xGizmo)
		GizmoUtil.translateMatrix(this.yGizmo)
		GizmoUtil.translateMatrix(this.zGizmo)
	}

	clearState(){
		this.#transformationIncrement.fill(0)
		this.#hasCloned = false
	}

	drawGizmo() {
		GizmoUtil.drawGizmo(this.mesh, this.xGizmo.matrix, AXIS.X)
		GizmoUtil.drawGizmo(this.mesh, this.yGizmo.matrix, AXIS.Y)
		GizmoUtil.drawGizmo(this.mesh, this.zGizmo.matrix, AXIS.Z)
	}


	onMouseMove(event:MouseEvent) {
		if(!this.#hasCloned && event.shiftKey){
			const clones = EngineTools.selected.map(m => m.clone())
			EngineStateService.appendBlock(clones)
			GizmoState.mainEntity = clones[0]
		}
		this.#hasCloned = event.shiftKey
		this.#gizmoTranslateEntity(event)
 	}

	#gizmoTranslateEntity(event) {
		const firstEntity = GizmoState.mainEntity
		const transformationIncrement = this.#transformationIncrement
		if (!firstEntity)
			return
		const grid = event.ctrlKey ? 1 : GizmoState.translationGridSize
		const vec = GizmoUtil.mapToScreenMovement(event)

		if (GizmoState.isGlobal)
			vec3.copy(<vec3>this.#transformationIncrement1, vec)
		else
			vec4.transformQuat(this.#transformationIncrement1, [vec[0], vec[1], vec[2], 1], firstEntity.rotationQuaternionFinal)


		vec3.add(transformationIncrement, transformationIncrement, <vec3>this.#transformationIncrement1)
		if (Math.abs(transformationIncrement[0]) >= grid || Math.abs(transformationIncrement[1]) >= grid || Math.abs(transformationIncrement[2]) >= grid) {
			const entities = EngineTools.selected
			const SIZE = entities.length
			if (SIZE === 1 && entities[0].lockedTranslation)
				return
			for (let i = 0; i < SIZE; i++) {
				const target = entities[i]
				if (target.lockedTranslation)
					continue
				transformationIncrement[0] = GizmoUtil.nearestX(transformationIncrement[0],grid)
				transformationIncrement[1] = GizmoUtil.nearestX(transformationIncrement[1],grid)
				transformationIncrement[2] = GizmoUtil.nearestX(transformationIncrement[2],grid)
				if (SIZE === 1 && event.altKey) {
					vec3.add(target.pivotPoint, target.pivotPoint, transformationIncrement)
					target.__pivotChanged = true
					continue
				}
				vec3.add(target._translation, target._translation, transformationIncrement)
				target.__changedBuffer[0] = 1
			}
			transformationIncrement[0] = transformationIncrement[1]= transformationIncrement[2]=0
			GizmoSystem.callListeners()
		}
	}


}
