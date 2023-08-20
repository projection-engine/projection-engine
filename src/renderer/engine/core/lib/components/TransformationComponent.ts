import Component from "./Component"
import ArrayBufferUtil from "../../utils/ArrayBufferUtil";
import {Components, TransformationRotationTypes,} from "@engine-core/engine.enum";

export default class TransformationComponent extends Component {
	getDependencies(): Components[] {
		return [];
	}

	static get componentKey(): Components {
		return Components.TRANSFORMATION
	}

	getComponentKey(): Components {
		return TransformationComponent.componentKey
	}
	__hasWorkerBound = false
	__changedBuffer = new Uint8Array(new SharedArrayBuffer(3))
	_rotationQuaternion = <Float32Array>ArrayBufferUtil.allocateVector(4, 0, true, true, false)
	_rotationQuaternionFinal = <Float32Array>ArrayBufferUtil.allocateVector(4, 0, true, true, false)
	_translation = <Float32Array>ArrayBufferUtil.allocateVector(3, 0, false, true, false)
	_scaling = <Float32Array>ArrayBufferUtil.allocateVector(3, 1, false, true, false)
	_rotationEuler = <Float32Array>ArrayBufferUtil.allocateVector(3, TransformationRotationTypes.ROTATION_QUATERNION, false, true, false)
	_rotationType = <Float32Array>ArrayBufferUtil.allocateVector(1, 0, false, true, false)

	pivotPoint = <Float32Array>ArrayBufferUtil.allocateVector(3, 0, false, true, false)
	matrix = <Float32Array>ArrayBufferUtil.allocateMatrix(4, true)
	baseTransformationMatrix = <Float32Array>ArrayBufferUtil.allocateMatrix(4, true)
	previousModelMatrix = <Float32Array>ArrayBufferUtil.allocateMatrix(4, true)
	lockedRotation = false
	lockedTranslation = false
	lockedScaling = false
	absoluteTranslation = <Float32Array>ArrayBufferUtil.allocateVector(3, 0, false, true, false)

	get hasWorkerBound() {
		return this.__hasWorkerBound
	}

	set hasWorkerBound(data) {
		this.__hasWorkerBound = data
	}

	get scaling() {
		return this._scaling
	}

	get translation() {
		return this._translation
	}

	get rotationType() {
		return this._rotationType
	}

	get rotationEuler() {
		return this._rotationEuler
	}

	get rotationQuaternion() {
		return this._rotationQuaternion
	}

	get rotationQuaternionFinal() {
		return this._rotationQuaternionFinal
	}

	get changed() {
		return this.__changedBuffer[0] === 1
	}

	set changed(data) {
		this.__changedBuffer[0] = data ? 1 : 0
	}

	get changesApplied() {
		return this.__changedBuffer[1] === 1
	}

	get isUnderChange() {
		return this.__changedBuffer[2] === 1
	}
}
