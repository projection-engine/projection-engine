import SHADING_MODELS from "../../../engine-core/static/SHADING_MODELS"
import LocalizationEN from "../../../shared/LocalizationEN"
import SettingsStore from "../../stores/SettingsStore"
import ConversionAPI from "../../../engine-core/lib/math/ConversionAPI"
import GPU from "../../../engine-core/GPU"
import PickingAPI from "../../../engine-core/lib/utils/PickingAPI"
import Engine from "../../../engine-core/Engine"
import VisibilityRenderer from "../../../engine-core/runtime/VisibilityRenderer"
import EngineTools from "../../../engine-core/tools/EngineTools"
import SelectionStoreUtil from "./SelectionStoreUtil"

export default class SceneEditorUtil {
	static #worker?: Worker

	static getLabel(shadingModel): string {
		switch (shadingModel) {
		case SHADING_MODELS.LIGHT_ONLY:
			return "SHADING_LIGHT"
		case SHADING_MODELS.ALBEDO:
			return "SHADING_UNLIT"
		case SHADING_MODELS.NORMAL:
			return "SHADING_NORMAL"
		case SHADING_MODELS.DEPTH:
			return "SHADING_DEPTH"
		case SHADING_MODELS.G_AO:
		case SHADING_MODELS.AO:
			return "SHADING_AO"
		case SHADING_MODELS.RANDOM:
			return "SHADING_RANDOM"
		case SHADING_MODELS.POSITION:
			return "POSITION"
		case SHADING_MODELS.DETAIL:
			return "SHADING_DETAIL"
		case SHADING_MODELS.ROUGHNESS:
			return "SHADING_ROUGHNESS"
		case SHADING_MODELS.METALLIC:
			return "SHADING_METALLIC"
		case SHADING_MODELS.LIGHT_COMPLEXITY:
			return "LIGHT_COMPLEXITY"
		case SHADING_MODELS.UV:
			return "SHADING_UV"
		case SHADING_MODELS.OVERDRAW:
			return "OVERDRAW"
		case SHADING_MODELS.LIGHT_QUANTITY:
			return "LIGHT_QUANTITY"
		default:
			return ""
		}
	}

	static getShadingModels() {
		return [
			{divider: true, label: LocalizationEN.MISC},
			{label: LocalizationEN.SHADING_DETAIL, id: SHADING_MODELS.DETAIL},
			{label: LocalizationEN.LIGHT_QUANTITY, id: SHADING_MODELS.LIGHT_QUANTITY},
			{divider: true, label: LocalizationEN.DEBUG_SHADING},
			{label: LocalizationEN.SHADING_DEPTH, id: SHADING_MODELS.DEPTH},
			{label: LocalizationEN.SHADING_RANDOM, id: SHADING_MODELS.RANDOM},
			{label: LocalizationEN.LIGHT_COMPLEXITY, id: SHADING_MODELS.LIGHT_COMPLEXITY},
			{label: LocalizationEN.POSITION, id: SHADING_MODELS.POSITION},
			{label: LocalizationEN.SHADING_DYNAMIC_AO, id: SHADING_MODELS.AO,},
			{label: LocalizationEN.OVERDRAW, id: SHADING_MODELS.OVERDRAW},
			{divider: true, label: LocalizationEN.MATERIAL},
			{label: LocalizationEN.SHADING_UNLIT, id: SHADING_MODELS.ALBEDO},
			{label: LocalizationEN.SHADING_ROUGHNESS, id: SHADING_MODELS.ROUGHNESS},
			{label: LocalizationEN.LIGHT_ONLY, id: SHADING_MODELS.LIGHT_ONLY}
		].map(e => e.divider ? e : ({
			...e,
			onClick: () => SettingsStore.getInstance().updateStore({shadingModel: e.id})
		}))
	}

	static getUnderSelectionBox(_, startCoords, endCoords) {
		const worker = SceneEditorUtil.worker()
		if (startCoords && endCoords) {
			EngineTools.drawIconsToBuffer()
			const nStart = ConversionAPI.toQuadCoord(startCoords, GPU.internalResolution)
			const nEnd = ConversionAPI.toQuadCoord(endCoords, GPU.internalResolution)
			try {

				const data = PickingAPI.readBlock(nStart, nEnd)
				worker.postMessage({entities: Engine.entities.array.map(e => ({id: e.id, pick: e.pickIndex})), data}, [data.buffer])
				worker.onmessage = ({data: selected}) => SelectionStoreUtil.setEntitiesSelected(selected)

			} catch (err) {
				console.error(err, startCoords, nStart)
			}

			VisibilityRenderer.needsUpdate = true
		}
	}

	static worker(): Worker {
		if (SceneEditorUtil.#worker)
			return SceneEditorUtil.#worker

		const src = ` 
            self.onmessage = ({data: {entities, data}}) => {
                const map = {}
                for(let i= 0; i < entities.length; i++){
                    const {id, pick} = entities[i]
                    map[Math.round(pick).toString()] = id
                }
                const selected = [], ids = []
                for (let i = 0; i < data.length; i += 4) {
                    const ID =  Math.round(data[i] + data[i + 1] + data[i + 1])
                    const found = map[ID.toString()]
                    if(!found || selected.includes(ID)) 
                        continue
                    selected.push(ID)
                    ids.push(found)
                }
                self.postMessage(ids)
            }
        `
		const workerBlob = new Blob([src], {type: "application/javascript"})
		const workerUrl = URL.createObjectURL(workerBlob)
		SceneEditorUtil.#worker = new Worker(workerUrl)
		return SceneEditorUtil.#worker
	}

}