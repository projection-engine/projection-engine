import GPUState from "../states/GPUState"
import GPUManager from "./GPUManager"

import EngineFileSystemManager from "./EngineFileSystemManager"
import Material from "@engine-core/lib/resources/Material"
import {MaterialDataTypes} from "@engine-core/engine.enum";

export default class MaterialManager {
    static #generator?: Generator<number>

    static* #getIncrementalID() {
        let counter = 0
        while (true) {
            yield counter
            counter++
        }
    }

    static registerMaterial(material) {
        if (material.bindID > -1)
            return
        if (!MaterialManager.#generator)
            MaterialManager.#generator = MaterialManager.#getIncrementalID()
        material.bindID = MaterialManager.#generator.next().value
    }

    static async updateMaterialUniforms(material: Material) {
        const data = material.uniforms
        if (!Array.isArray(data))
            return
        await MaterialManager.mapUniforms(data, material.uniformValues)
    }

    static async mapUniforms(data: MaterialUniform[], uniformValues: MutableObject) {
        if (!Array.isArray(data))
            return
        Object.keys(uniformValues).forEach((key) => delete uniformValues[key])
        for (let i = 0; i < data.length; i++) {
            const currentUniform = data[i]
            uniformValues[currentUniform.key] = currentUniform.data
        }
    }

}
