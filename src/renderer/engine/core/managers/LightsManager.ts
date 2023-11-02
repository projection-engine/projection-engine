import ArrayBufferUtil from "../utils/ArrayBufferUtil"
import {glMatrix, mat4, vec3} from "gl-matrix"
import StaticUBOState from "../states/StaticUBOState"
import EngineState from "../states/EngineState";
import {Components, LightTypes,} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import LightComponent from "@engine-core/lib/components/LightComponent";
import AbstractSingleton from "@engine-core/AbstractSingleton";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import AtmosphereComponent from "@engine-core/lib/components/AtmosphereComponent";
import GPUState from "@engine-core/states/GPUState";

export default class LightsManager extends AbstractSingleton {
    /**
     * indexes 0-3 are reserved for [type - color - color - color]
     * @private
     */
    #primaryBuffer?: Float32Array
    #secondaryBuffer?: Float32Array
    #lightsQuantity = 0
    static #lightTimeout

    constructor() {
        super();
        EntityManager.addEventListener("hard-change", (event) => {
            event.all.forEach(entity => {
                const component = EntityManager.getComponent<LightComponent>(entity, Components.LIGHT)
                if (component != null) {

                }
            })
        })
        this.#primaryBuffer = <Float32Array>ArrayBufferUtil.allocateVector(GPUState.MAX_LIGHTS * 16, 0, false, false, false)
        this.#secondaryBuffer = <Float32Array>ArrayBufferUtil.allocateVector(GPUState.MAX_LIGHTS * 16, 0, false, false, false)
    }

    static packageLights(keepOld = false, force = false) {
        const instance = this.get<LightsManager>()
        if (force) {
            instance.#package(keepOld)
            return
        }
        clearTimeout(LightsManager.#lightTimeout)
        LightsManager.#lightTimeout = setTimeout(() => instance.#package(keepOld), 50)
    }

    #package(keepOld: boolean) {
        const lights = EntityManager.withComponent(Components.LIGHT).array
        const primaryBuffer = this.#primaryBuffer,
            secondaryBuffer = this.#secondaryBuffer
        let size = 0, offset = 0


        if (!keepOld)
            for (let i = 0; i < primaryBuffer.length; i++) {
                primaryBuffer[i] = 0
                secondaryBuffer[i] = 0
            }

        const toLoopSize = lights.length
        for (let i = 0; i < toLoopSize; i++) {
            const current = lights[i]
            if (offset + 16 > GPUState.MAX_LIGHTS * 16)
                break
            const transformationComponent = EntityManager.getComponent<TransformationComponent>(current, Components.TRANSFORMATION)
            const light = EntityManager.getComponent<LightComponent>(current, Components.LIGHT)
            if (!EntityManager.isEntityEnabled(current) || !transformationComponent.changesApplied && !light.needsRepackaging && keepOld)
                continue
            this.#updateLightComponent(current, primaryBuffer, secondaryBuffer, offset)

            offset += 16
            size++
        }

        const atmospheres = EntityManager.withComponent(Components.ATMOSPHERE).array
        for (let i = 0; i < atmospheres.length; i++) {
            const current = atmospheres[i]
            if (offset + 16 > GPUState.MAX_LIGHTS * 16)
                break
            const transformationComponent = EntityManager.getComponent<TransformationComponent>(current, Components.TRANSFORMATION)
            const atmosphere = EntityManager.getComponent<AtmosphereComponent>(current, Components.ATMOSPHERE)
            if (!EntityManager.isEntityEnabled(current) || !transformationComponent.changesApplied && !atmosphere.needsRepackaging && keepOld)
                continue
            this.#updateAtmosphereComponent(atmosphere, primaryBuffer, offset)

            offset += 16
            size++
        }

        this.#lightsQuantity = size
        if (this.#lightsQuantity > 0 || !keepOld) {
            StaticUBOState.lightsUBO.bind()
            StaticUBOState.lightsUBO.updateData("lightPrimaryBuffer", this.#primaryBuffer)
            StaticUBOState.lightsUBO.updateData("lightSecondaryBuffer", this.#secondaryBuffer)
            StaticUBOState.lightsUBO.unbind()

            StaticUBOState.uberUBO.bind()
            const quantity = new Uint8Array(1)
            quantity[0] = Math.min(this.#lightsQuantity, GPUState.MAX_LIGHTS)
            StaticUBOState.uberUBO.updateData("lightQuantity", quantity)
            StaticUBOState.uberUBO.unbind()
        }
    }

    #updateAtmosphereComponent(component: AtmosphereComponent, primaryBuffer: Float32Array, offset: number) {
        const position = component.sunDirection
        primaryBuffer[offset + 1] = component.intensity / 10
        primaryBuffer[offset + 2] = component.intensity / 10
        primaryBuffer[offset + 3] = component.intensity / 10

        primaryBuffer[offset + 4] = position[0] * 6420e3 * component.atmosphereRadius
        primaryBuffer[offset + 5] = position[1] * 6420e3 * component.atmosphereRadius
        primaryBuffer[offset + 6] = position[2] * 6420e3 * component.atmosphereRadius

        primaryBuffer[offset + 8] = 0
        primaryBuffer[offset + 9] = 0
        primaryBuffer[offset + 10] = -1
        primaryBuffer[offset + 12] = 0
        primaryBuffer[offset + 13] = 0
        primaryBuffer[offset + 14] = 0
    }

    #updateLightComponent(entity: EngineEntity, primaryBuffer: Float32Array, secondaryBuffer: Float32Array, offset: number) {
        const component = EntityManager.getComponent<LightComponent>(entity, Components.LIGHT)
        const transformationComponent = EntityManager.getComponent<TransformationComponent>(entity, Components.TRANSFORMATION)
        const color = component.fixedColor
        const position = transformationComponent.absoluteTranslation
        const attenuation = component.attenuation
        const transformedNormalCache = vec3.create()
        const lightViewProjection = mat4.create()

        const cache1Mat4 = mat4.create()
        const cache2Mat4 = mat4.create()

        primaryBuffer[offset] = component.type
        primaryBuffer[offset + 1] = color[0]
        primaryBuffer[offset + 2] = color[1]
        primaryBuffer[offset + 3] = color[2]

        primaryBuffer[offset + 4] = position[0]
        primaryBuffer[offset + 5] = position[1]
        primaryBuffer[offset + 6] = position[2]

        switch (component.type) {
            case LightTypes.DIRECTIONAL: {

                primaryBuffer[offset + 8] = component.atlasFace[0]
                primaryBuffer[offset + 9] = component.atlasFace[1]
                primaryBuffer[offset + 10] = (component.shadowMap ? 1 : -1) * component.shadowSamples
                primaryBuffer[offset + 12] = component.shadowBias
                primaryBuffer[offset + 13] = component.shadowAttenuationMinDistance
                primaryBuffer[offset + 14] = component.hasSSS ? 1 : 0

                if (component.shadowMap) {
                    mat4.lookAt(component.__lightView, position, [0, 0, 0], [0, 1, 0])
                    mat4.ortho(component.__lightProjection, -component.size, component.size, -component.size, component.size, component.zNear, component.zFar)
                    mat4.multiply(lightViewProjection, component.__lightProjection, component.__lightView)

                    for (let i = 0; i < 16; i++)
                        secondaryBuffer[offset + i] = lightViewProjection[i]

                    EngineState.directionalLightsToUpdate.push(component)
                }
                break
            }
            case LightTypes.POINT: {
                primaryBuffer[7 + offset] = component.shadowSamples
                primaryBuffer[8 + offset] = attenuation[0]
                primaryBuffer[9 + offset] = attenuation[1]
                primaryBuffer[10 + offset] = component.cutoff
                primaryBuffer[11 + offset] = component.zNear
                primaryBuffer[12 + offset] = component.zFar
                primaryBuffer[13 + offset] = (component.shadowMap ? -1 : 1) * (component.hasSSS ? 2 : 1)
                primaryBuffer[14 + offset] = component.shadowAttenuationMinDistance
                primaryBuffer[15 + offset] = component.cutoff * component.smoothing

                secondaryBuffer[0] = component.shadowBias
                if (component.shadowMap)
                    EngineState.omnidirectionalLightsToUpdate.push(component)
                break
            }
            case LightTypes.SPOT: {
                mat4.lookAt(cache1Mat4, position, position, [0, 1, 0])
                mat4.fromQuat(cache2Mat4, transformationComponent.rotationQuaternionFinal)
                mat4.multiply(cache1Mat4, cache1Mat4, cache2Mat4)


                primaryBuffer[8 + offset] = cache1Mat4[8]
                primaryBuffer[9 + offset] = cache1Mat4[9]
                primaryBuffer[10 + offset] = cache1Mat4[10]

                primaryBuffer[11 + offset] = component.cutoff

                primaryBuffer[12 + offset] = attenuation[0]
                primaryBuffer[13 + offset] = attenuation[1]

                primaryBuffer[14 + offset] = Math.cos(glMatrix.toRadian(component.radius))
                primaryBuffer[15 + offset] = component.hasSSS ? 1 : 0

                break
            }
            case LightTypes.SPHERE: {
                primaryBuffer[8 + offset] = component.areaRadius
                primaryBuffer[9 + offset] = 0
                primaryBuffer[10 + offset] = 0

                primaryBuffer[11 + offset] = component.cutoff

                primaryBuffer[12 + offset] = attenuation[0]
                primaryBuffer[13 + offset] = attenuation[1]

                primaryBuffer[14 + offset] = 0
                primaryBuffer[15 + offset] = component.hasSSS ? 1 : 0
                break
            }
            case LightTypes.DISK: {
                primaryBuffer[8 + offset] = component.areaRadius
                primaryBuffer[9 + offset] = attenuation[0]
                primaryBuffer[10 + offset] = attenuation[1]
                /**
                 * Light normal
                 */
                vec3.transformMat4(transformedNormalCache, [0, 1, 0], transformationComponent.matrix)
                primaryBuffer[11 + offset] = transformedNormalCache[0]
                primaryBuffer[12 + offset] = transformedNormalCache[1]
                primaryBuffer[13 + offset] = transformedNormalCache[2]

                primaryBuffer[14 + offset] = component.cutoff
                primaryBuffer[15 + offset] = component.hasSSS ? 1 : 0

                break
            }
        }

    }


}
