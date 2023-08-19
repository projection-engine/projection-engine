import Component from "./Component"

import MESH_PROPS from "../../static/component-props/MESH_PROPS"
import MaterialManager from "../../managers/MaterialManager"
import GPUState from "../../states/GPUState"
import EngineFileSystemManager from "../../managers/EngineFileSystemManager"
import {Components,} from "@engine-core/engine.enum";
import Mesh from "@engine-core/lib/resources/Mesh";
import Material from "@engine-core/lib/resources/Material";

export default class MeshComponent extends Component {
    getDependencies(): Components[] {
        return [Components.TRANSFORMATION, Components.CULLING];
    }

    static get componentKey(): Components {
        return Components.MESH
    }

    getComponentKey(): Components {
        return MeshComponent.componentKey
    }

    _props = MESH_PROPS

    castsShadows = true
    meshID?: string
    _materialID?: string

    _mappedUniforms = {}
    #materialUniforms: MaterialUniform[] = []

    updateMaterialUniformValue(key: string, value: any) {
        this._mappedUniforms[key] = value
    }

    get mappedUniforms() {
        return this._mappedUniforms
    }

    contributeToProbes = true
    overrideMaterialUniforms = false

    resetUniforms() {
        if (!this.materialID)
            return
        const mat = GPUState.materials.get(this.materialID)
        this.#materialUniforms = mat.uniforms
        this._mappedUniforms = {}
        MaterialManager.mapUniforms(this.#materialUniforms, this._mappedUniforms).catch(console.error)
    }

    set materialID(materialID) {
        this._mappedUniforms = {}
        this.#materialUniforms = null
        this._materialID = materialID
    }

    get materialUniforms(): MaterialUniform[] {
        return this.#materialUniforms
    }

    get materialID() {
        return this._materialID
    }


    getMeshInstance(): Mesh | undefined {
        if (!this.meshID)
            return null
        if (GPUState.meshes.has(this.meshID))
            return GPUState.meshes.get(this.meshID)
        EngineFileSystemManager.loadMesh(this.meshID).catch(console.error)
        return null
    }

    getMaterialInstance(): Material | null {
        if (!this._materialID)
            return null
        if (GPUState.materials.has(this._materialID))
            return GPUState.materials.get(this._materialID)
        EngineFileSystemManager.loadMaterial(this._materialID).catch(console.error)
        return null
    }
}
