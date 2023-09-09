import AbstractComponent from "./AbstractComponent"
import {vec3} from "gl-matrix"
import {AtmosphereTypes, Components,} from "@engine-core/engine.enum";

export default class AtmosphereComponent extends AbstractComponent {
    getDependencies(): Components[] {
        return [Components.TRANSFORMATION];
    }

    static get componentKey(): Components {
        return Components.ATMOSPHERE
    }

    getComponentKey(): Components {
        return AtmosphereComponent.componentKey
    }

    #needsRepackaging = false
    _elapsedTime = 0
    #sunDirection = vec3.normalize(<vec3>[0, 1, 1], [Math.sin(this._elapsedTime), Math.cos(this._elapsedTime), 1.0])
    maxSamples = 10
    mieHeight = 1000
    rayleighHeight = 8000
    atmosphereRadius = 1
    planetRadius = 1
    intensity = 20
    renderingType = AtmosphereTypes.COMBINED
    betaRayleigh = [1., 1, 1]
    betaMie = [1, 1, 1]
    threshold = 0

    get sunDirection() {
        return this.#sunDirection
    }

    set elapsedTime(data) {
        this._elapsedTime = data
        vec3.normalize(this.#sunDirection, [Math.sin(this._elapsedTime), Math.cos(this._elapsedTime), 1.0])
        this.#needsRepackaging = true
    }

    get elapsedTime() {
        return this._elapsedTime
    }

    get needsRepackaging(): boolean {
        return this.#needsRepackaging;
    }
}
