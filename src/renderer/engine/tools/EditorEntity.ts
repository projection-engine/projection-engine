import * as crypto from "crypto";
import EntityManager from "@engine-core/EntityManager";
import Component from "@engine-core/components/Component";
import {mat4, quat, vec3} from "gl-matrix";
import {Components} from "@engine-core/engine.enum";


export default class EditorEntity implements IEditorEntity {
    id = crypto.randomUUID()
    _colorIdentifier: [number, number, number] = [255, 255, 255]
    name = ""
    __cacheCenterMatrix: mat4
    __cacheIconMatrix: mat4
    __cameraIconMatrix: mat4
    __pivotOffset: vec3
    __isSelected = false
    __originalTranslation: vec3 = undefined
    __originalPivot: vec3 = undefined
    __originalScaling: vec3 = undefined
    __originalQuat: quat = undefined

    constructor(id?: EngineEntity) {
        this.id = id ?? this.id
    }

    get colorIdentifier() {
        return this._colorIdentifier
    }

    set colorIdentifier(data) {
        if (data && Array.isArray(data))
            this._colorIdentifier = data
    }

    get active() {
        return EntityManager.isEntityEnabled(this.id)
    }

    get allComponents(): Component[] {
        return EntityManager.getAllComponents(this.id)
    }

    getComponent<T extends Component>(comp: Components): T {
        return EntityManager.getComponent<T>(this.id, comp)
    }

    get children(): EngineEntity[] {
        return EntityManager.getChildren(this.id)
    }

    get parent(): EngineEntity {
        return EntityManager.getParent(this.id)
    }

    hasComponent(comp: Components) {
        return EntityManager.hasComponent(this.id, comp)
    }
}
