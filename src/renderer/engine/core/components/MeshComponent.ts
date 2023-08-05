import Component from "./Component"

import MESH_PROPS from "../static/component-props/MESH_PROPS"
import MaterialAPI from "../lib/rendering/MaterialAPI"
import GPU from "../GPU"
import FileSystemAPI from "../lib/utils/FileSystemAPI"
import {Components,} from "@engine-core/engine.enum";

export default class MeshComponent extends Component {
    static get componentKey(): Components {
        return Components.MESH
    }

    getComponentKey(): Components {
        return MeshComponent.componentKey
    }

    _props = MESH_PROPS

    castsShadows = true
    _meshID?: string
    _materialID?: string

    #texturesInUse = {}
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

    #bindMesh(meshID: string) {
        let found = GPU.meshes.get(meshID)
        if (!found)
            FileSystemAPI.loadMesh(meshID).then(_ => {
                found = GPU.meshes.get(meshID)
                if (!found) {
                    console.error("Mesh not found")
                    return
                }
                this._meshID = meshID
            })
        else
            this._meshID = meshID
    }

    set meshID(meshID) {
        this._meshID = meshID
        if (meshID)
            this.#bindMesh(meshID)
        else
            this._meshID = undefined
    }

    get meshID() {
        return this._meshID
    }

    #bindMaterial(materialID: string) {
        let found = GPU.materials.get(materialID)
        if (!found)
            FileSystemAPI.loadMaterial(materialID).then(_ => {
                found = GPU.materials.get(materialID)
                if (!found) {
                    console.error("Material not found")
                    return
                }
                this._materialID = materialID
                this.#materialUniforms = found.uniforms
                this._mappedUniforms = {}
                MaterialAPI.mapUniforms(this.#materialUniforms, this.#texturesInUse, this._mappedUniforms).catch(console.error)
            })
        else {
            this._materialID = materialID
            this.#materialUniforms = found.uniforms
            this._mappedUniforms = {}
            MaterialAPI.mapUniforms(this.#materialUniforms, this.#texturesInUse, this._mappedUniforms).catch(console.error)
        }
    }

    set materialID(materialID) {
        if (materialID)
            this.#bindMaterial(materialID)
        else
            this._materialID = materialID
    }

    get materialUniforms(): MaterialUniform[] {
        return this.#materialUniforms
    }

    get hasMesh(): boolean {
        return this._meshID !== undefined
    }

    get texturesInUse() {
        return this.#texturesInUse
    }

    get hasMaterial(): boolean {
        return this._materialID !== undefined
    }

    get materialID() {
        return this._materialID
    }

}
