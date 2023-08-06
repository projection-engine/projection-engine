import Component from "./Component"
import CULLING_COMPONENT_PROPS from "../static/component-props/CULLING_COMPONENT_PROPS"
import {Components,} from "@engine-core/engine.enum";

export default class CullingComponent extends Component {
    static get componentKey(): Components {
        return Components.CULLING
    }

    getComponentKey(): Components {
        return CullingComponent.componentKey
    }

    __cullingMetadata = new Float32Array(new SharedArrayBuffer(24))
    _props = CULLING_COMPONENT_PROPS

    constructor(entity: EngineEntity) {
        super(entity);
        this.isDistanceCulled = false
        this.isScreenDoorEnabled = false
        this.distanceFromCamera = 100
    }
    
    get distanceFromCamera() {
        return this.__cullingMetadata[0]
    }

    get cullingDistance() {
        return this.__cullingMetadata[1]
    }

    get hasDistanceCullingEnabled() {
        return this.__cullingMetadata[2] === 1
    }

    get isDistanceCulled() {
        return this.__cullingMetadata[3] === 1
    }

    get screenDoorDistance() {
        return this.__cullingMetadata[4]
    }

    get isScreenDoorEnabled() {
        return this.__cullingMetadata[5] === 1
    }

    set distanceFromCamera(data) {
        this.__cullingMetadata[0] = data
    }

    set cullingDistance(data) {
        this.__cullingMetadata[1] = data
    }

    set hasDistanceCullingEnabled(data) {
        this.__cullingMetadata[2] = data ? 1 : 0
    }

    set isDistanceCulled(data) {
        this.__cullingMetadata[3] = data ? 1 : 0
    }

    set screenDoorDistance(data) {
        this.__cullingMetadata[4] = data
    }

    set isScreenDoorEnabled(data) {
        this.__cullingMetadata[5] = data ? 1 : 0

    }
}
