import Component from "./Component"
import ArrayBufferAPI from "../lib/utils/ArrayBufferAPI";
import {Components, TransformationRotationTypes,} from "@engine-core/engine.enum";


export default class TransformationComponent extends Component {
	static get componentKey(): Components {
		return Components.TRANSFORMATION
	}
	getComponentKey(): Components {
		return TransformationComponent.componentKey
	}
	__hasWorkerBound = false
	__changedBuffer = new Uint8Array(new SharedArrayBuffer(3))
	__cullingMetadata = new Float32Array(new SharedArrayBuffer(24))
	_rotationQuaternion = <Float32Array>ArrayBufferAPI.allocateVector(4, 0, true, true, false)
	_rotationQuaternionFinal = <Float32Array>ArrayBufferAPI.allocateVector(4, 0, true, true, false)
	_translation = <Float32Array>ArrayBufferAPI.allocateVector(3, 0, false, true, false)
	_scaling = <Float32Array>ArrayBufferAPI.allocateVector(3, 1, false, true, false)
	_rotationEuler = <Float32Array>ArrayBufferAPI.allocateVector(3, TransformationRotationTypes.ROTATION_QUATERNION, false, true, false)
	_rotationType = <Float32Array>ArrayBufferAPI.allocateVector(1, 0, false, true, false)

	pivotPoint = <Float32Array>ArrayBufferAPI.allocateVector(3, 0, false, true, false)
	matrix = <Float32Array>ArrayBufferAPI.allocateMatrix(4, true)
	baseTransformationMatrix = <Float32Array>ArrayBufferAPI.allocateMatrix(4, true)
	previousModelMatrix = <Float32Array>ArrayBufferAPI.allocateMatrix(4, true)
	lockedRotation = false
	lockedTranslation = false
	lockedScaling = false
	absoluteTranslation = <Float32Array>ArrayBufferAPI.allocateVector(3, 0, false, true, false)

}
