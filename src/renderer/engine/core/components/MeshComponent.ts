import Component from "./Component"

import MESH_PROPS from "../static/component-props/MESH_PROPS"
import MaterialAPI from "../lib/rendering/MaterialAPI"
import GPU from "../GPU"
import FileSystemAPI from "../lib/utils/FileSystemAPI"
import {Components,} from "@engine-core/engine.enum";
import Mesh from "@engine-core/instances/Mesh";
import Material from "@engine-core/instances/Material";

export default class MeshComponent extends Component {
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
        const mat = GPU.materials.get(this.materialID)
        this.#materialUniforms = mat.uniforms
        this._mappedUniforms = {}
        MaterialAPI.mapUniforms(this.#materialUniforms, this._mappedUniforms).catch(console.error)
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
        if (GPU.meshes.has(this.meshID))
            return GPU.meshes.get(this.meshID)
        FileSystemAPI.loadMesh(this.meshID).catch(console.error)
        return null
    }

    getMaterialInstance(): Material | null {
        if (!this._materialID)
            return null
        if (GPU.materials.has(this._materialID))
            return GPU.materials.get(this._materialID)
        FileSystemAPI.loadMaterial(this._materialID).catch(console.error)
        return null
    }
}
