import AbstractComponent from "./AbstractComponent"
import {mat4} from "gl-matrix"
import {Components, LightTypes,} from "@engine-core/engine.enum";


export default class LightComponent extends AbstractComponent {
	getDependencies(): Components[] {
		return [Components.TRANSFORMATION, Components.CULLING];
	}

	get planeAreaHeight(): number {
		return this._planeAreaHeight;
	}

	set planeAreaHeight(value: number) {
		this.#needsRepackaging = true
		this._planeAreaHeight = value;
	}
	get planeAreaWidth(): number {
		return this._planeAreaWidth;
	}

	set planeAreaWidth(value: number) {
		this.#needsRepackaging = true
		this._planeAreaWidth = value;
	}

	get areaRadius(): number {
		return this._areaRadius;
	}

	set areaRadius(value: number) {
		this.#needsRepackaging = true
		this._areaRadius = value;
	}

	get size(): number {
		return this._size;
	}

	set size(value: number) {
		this.#needsRepackaging = true
		this._size = value;
	}

	get radius(): number {
		return this._radius;
	}

	set radius(value: number) {
		this.#needsRepackaging = true
		this._radius = value;
	}

	get smoothing(): number {
		return this._smoothing;
	}

	set smoothing(value: number) {
		this.#needsRepackaging = true
		this._smoothing = value;
	}

	get attenuation(): number[] {
		return this._attenuation;
	}

	set attenuation(value: number[]) {
		this.#needsRepackaging = true
		this._attenuation = value;
	}

	get shadowAttenuationMinDistance(): number {
		return this._shadowAttenuationMinDistance;
	}

	set shadowAttenuationMinDistance(value: number) {
		this.#needsRepackaging = true
		this._shadowAttenuationMinDistance = value;
	}

	get cutoff(): number {
		return this._cutoff;
	}

	set cutoff(value: number) {
		this._cutoff = value;
		this.#needsRepackaging = true
	}

	get zFar(): number {
		return this._zFar;
	}

	set zFar(value: number) {
		this.#needsRepackaging = true
		this._zFar = value;
	}

	get zNear(): number {
		return this._zNear;
	}

	set zNear(value: number) {
		this._zNear = value;
		this.#needsRepackaging = true

	}

	get shadowSamples(): number {
		return this._shadowSamples;
	}

	set shadowSamples(value: number) {
		this._shadowSamples = value;
		this.#needsRepackaging = true
	}

	get shadowBias(): number {
		return this._shadowBias;
	}

	set shadowBias(value: number) {
		this._shadowBias = value;
		this.#needsRepackaging = true
	}

	get hasSSS(): boolean {
		return this._hasSSS;
	}

	set hasSSS(value: boolean) {
		this._hasSSS = value;
		this.#needsRepackaging = true
	}

	get needsRepackaging(): boolean {
		return this.#needsRepackaging;
	}

	static get componentKey(): Components {
		return Components.LIGHT
	}

	getComponentKey(): Components {
		return LightComponent.componentKey
	}

	#needsRepackaging = false
	// -------------- GLOBAL --------------
	_color = [255, 255, 255]
	 fixedColor = [1, 1, 1]
	_type = LightTypes.DIRECTIONAL
	private _hasSSS = false
	private _shadowBias = .0001
	private _shadowSamples = 3
	private _zNear = 1
	private _zFar = 10000
	private _cutoff = 50
	private _shadowAttenuationMinDistance = 50

	// -------------- NOT DIRECTIONAL --------------
	private _attenuation = [0, 0]
	private _smoothing = .5

	// -------------- SPOTLIGHT --------------
	private _radius = 45

	// -------------- DIRECTIONAL --------------
	private _size = 35
	atlasFace = [0, 0]
	__lightView = mat4.create()
	__lightProjection = mat4.create()
	// -------------- AREA --------------
	private _areaRadius = 1
	private _planeAreaWidth = 1
	private _planeAreaHeight = 1

	// -------------- GLOBAL --------------
	_intensity = 1
	get intensity() {
		return this._intensity
	}

	set intensity(data) {
		this._intensity = data
		this.fixedColor = [this._color[0] * this.intensity / 255, this._color[1] * this.intensity / 255, this._color[2] * this.intensity / 255]
		this.#needsRepackaging = true
	}
	get type() {
		return this._type
	}

	set type(data) {
		this.#needsRepackaging = true
		this._type = data
	}
	get color() {
		return this._color
	}

	set color(data) {
		this._color = data
		this.#needsRepackaging = true
		this.fixedColor = [this._color[0] * this.intensity / 255, this._color[1] * this.intensity / 255, this._color[2] * this.intensity / 255]
	}

	_shadowMap = true
	get shadowMap() {
		return this._shadowMap
	}

	set shadowMap(data) {
		if (this._shadowMap !== data)
			this.#needsRepackaging = true
		this._shadowMap = data
	}


}
