import Engine from "../../core/Engine"
import GPU from "../../core/GPU"
import CameraAPI from "../../core/lib/utils/CameraAPI"
import LIGHT_TYPES from "../../core/static/LIGHT_TYPES"
import LineRenderer from "./LineRenderer"
import StaticMeshes from "../../core/lib/StaticMeshes"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import {mat4} from "gl-matrix"
import MATERIAL_RENDERING_TYPES from "../../core/static/MATERIAL_RENDERING_TYPES"
import Entity from "../../core/instances/Entity"
import StaticFBO from "../../core/lib/StaticFBO"
import EngineToolsState from "../EngineToolsState"
import GizmoUtil from "../gizmo/util/GizmoUtil"
import GPUUtil from "../../core/utils/GPUUtil";


const iconAttributes = mat4.create()
export default class IconsSystem {
	static iconsTexture?: WebGLTexture

	static loop(cb, uniforms?: MutableObject) {
		const tracking = CameraAPI.trackingEntity
		const entities = Engine.entities.array
		const size = entities.length

		for (let i = 0; i < size; i++) {
			const entity = entities[i]
			if (entity.isCollection || !entity.active || entity.spriteComponent !== undefined || entity.distanceFromCamera > EngineToolsState.maxDistanceIcon)
				continue
			const hasLight = entity.lightComponent !== undefined
			const hasProbe = entity.lightProbeComponent !== undefined
			const hasCamera = entity.cameraComponent !== undefined
			const hasDecal = entity.cameraComponent !== undefined
			const hasAtmosphere = entity.cameraComponent !== undefined
			const doesntHaveIcon = !hasLight && !hasProbe && !hasCamera && !hasDecal && !hasAtmosphere

			if (
				tracking === entity ||
                doesntHaveIcon && entity.uiComponent ||
                entity.meshComponent?.hasMesh && entity.materialRef?.renderingMode !== MATERIAL_RENDERING_TYPES.SKY ||
                doesntHaveIcon && entity.meshComponent?.hasMesh && entity.materialRef?.renderingMode !== MATERIAL_RENDERING_TYPES.SKY ||
                doesntHaveIcon && !entity.meshComponent?.hasMesh
			)
				continue
			cb(entity, uniforms)
		}
	}

	static drawIcon(
		entity: Entity,
		U
	) {
		const uniforms = U || StaticEditorShaders.iconUniforms
		const context = GPU.context
		const lightComponent = entity.lightComponent
		const lightType = lightComponent?.type
		let doNotFaceCamera = 0,
			drawSphere = 0,
			removeSphereCenter = 0,
			scale = EngineToolsState.iconScale,
			imageIndex = 0
		const isSelected = entity.__isSelected ? 1 : 0,
			color = entity.colorIdentifier

		switch (lightType) {
		case LIGHT_TYPES.DIRECTIONAL:
			imageIndex = 1
			break
		case LIGHT_TYPES.POINT:
			imageIndex = 2
			break
		case LIGHT_TYPES.SPOT:
			imageIndex = 4
			break
		case LIGHT_TYPES.SPHERE:
			imageIndex = -1
			drawSphere = 1
			scale = lightComponent.areaRadius
			removeSphereCenter = 0
			break
		case LIGHT_TYPES.DISK:
			imageIndex = -1
			doNotFaceCamera = 1
			drawSphere = 1
			removeSphereCenter = 1
			scale = lightComponent.areaRadius
			break
		}


		// if (hasCamera)
		//     imageIndex = imageIndex !== 0 ? 0 : 5
		if (entity.lightProbeComponent)
			imageIndex = imageIndex !== 0 ? 0 : 3
		if (entity.atmosphereComponent)
			imageIndex = imageIndex !== 0 ? 0 : 5
		if (entity.decalComponent)
			imageIndex = imageIndex !== 0 ? 0 : 6
		// if (hasCamera)
		//     imageIndex = imageIndex !== 0 ? 0 : 5


		iconAttributes[0] = doNotFaceCamera
		iconAttributes[1] = drawSphere
		iconAttributes[2] = removeSphereCenter
		iconAttributes[3] = scale

		iconAttributes[4] = imageIndex
		iconAttributes[5] = isSelected

		iconAttributes[8] = color[0]
		iconAttributes[9] = color[1]
		iconAttributes[10] = color[2]


		GizmoUtil.createTransformationCache(entity)
		if (uniforms.entityID !== undefined)
			context.uniform3fv(uniforms.entityID, entity.pickID)

		context.uniformMatrix4fv(uniforms.settings, false, iconAttributes)
		context.uniformMatrix4fv(uniforms.transformationMatrix, false, entity.__cacheIconMatrix)
		StaticMeshes.drawQuad()
	}

	static #drawVisualizations(entity: Entity) {
		const hasLight = entity.lightComponent
		const hasCamera = entity.cameraComponent
		if (!hasCamera && !hasLight)
			return

		const component = entity.lightComponent
		let lineSize = -50
		if (!hasCamera)
			switch (component.type) {
			case LIGHT_TYPES.DISK:
			case LIGHT_TYPES.SPOT:
				lineSize = component.cutoff * 4
				break
			case LIGHT_TYPES.SPHERE:
			case LIGHT_TYPES.POINT:
				lineSize = -component.cutoff * 4
				break
			}

		LineRenderer.setState(!entity.__isSelected, true, lineSize)
		if (hasLight) {
			if (component.type === LIGHT_TYPES.SPOT)
				LineRenderer.drawZ(entity.__cacheIconMatrix)
			else
				LineRenderer.drawY(entity.__cacheIconMatrix)
		}
		if (hasCamera)
			LineRenderer.drawZ(entity.__cacheIconMatrix)
	}

	static execute() {
		if (!IconsSystem.iconsTexture)
			return
		const context = GPU.context
		const uniforms = StaticEditorShaders.iconUniforms

		StaticEditorShaders.icon.bind()

		GPUUtil.bind2DTextureForDrawing(uniforms.iconSampler, 0, IconsSystem.iconsTexture)

		GPUUtil.bind2DTextureForDrawing(uniforms.sceneDepth, 1, StaticFBO.sceneDepthVelocity)

		context.uniformMatrix4fv(uniforms.projectionM, false, CameraAPI.projectionMatrix)
		context.uniformMatrix4fv(uniforms.viewM, false, CameraAPI.viewMatrix)

		if (EngineToolsState.showIcons)
			IconsSystem.loop(IconsSystem.drawIcon)
		if (EngineToolsState.showLines)
			IconsSystem.loop(IconsSystem.#drawVisualizations)
		LineRenderer.finish()


	}


}
