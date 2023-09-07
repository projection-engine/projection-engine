import Component from "./Component"
import {Components,} from "@engine-core/engine.enum";
import TransformationManager from "@engine-core/managers/TransformationManager";

export default class CullingComponent extends Component {
    getDependencies(): Components[] {
        return [Components.TRANSFORMATION];
    }

    static get componentKey(): Components {
        return Components.CULLING
    }

    getComponentKey(): Components {
        return CullingComponent.componentKey
    }

    #getCullingMetadata(){
        return TransformationManager.getCullingMetadata(this.entity)
    }

    constructor(entity: EngineEntity) {
        super(entity);
        this.isDistanceCulled = false
        this.isScreenDoorEnabled = false
        this.distanceFromCamera = 100
    }

    get cullingDistance() {
        return this.#getCullingMetadata()[1]
    }

    get hasDistanceCullingEnabled() {
        return this.#getCullingMetadata()[2] === 1
    }

    get isDistanceCulled() {
        return this.#getCullingMetadata()[3] === 1
    }

    get screenDoorDistance() {
        return this.#getCullingMetadata()[4]
    }

    get isScreenDoorEnabled() {
        return this.#getCullingMetadata()[5] === 1
    }

    get distanceFromCamera() {
        return this.#getCullingMetadata()[0]
    }

    set distanceFromCamera(data) {
        this.#getCullingMetadata()[0] = data
    }

    set cullingDistance(data) {
        this.#getCullingMetadata()[1] = data
    }

    set hasDistanceCullingEnabled(data) {
        this.#getCullingMetadata()[2] = data ? 1 : 0
    }

    set isDistanceCulled(data) {
        this.#getCullingMetadata()[3] = data ? 1 : 0
    }

    set screenDoorDistance(data) {
        this.#getCullingMetadata()[4] = data
    }

    set isScreenDoorEnabled(data) {
        this.#getCullingMetadata()[5] = data ? 1 : 0
    }
}
