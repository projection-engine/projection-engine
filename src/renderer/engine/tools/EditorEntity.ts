import EntityManager from "@engine-core/managers/EntityManager";
import Component from "@engine-core/lib/components/Component";
import {mat4, quat, vec3} from "gl-matrix";
import {Components} from "@engine-core/engine.enum";
import EditorEntityManager from "./EditorEntityManager";


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
    private __collisionUpdated: boolean;
    __collisionTransformationMatrix: mat4;

    constructor(id?: EngineEntity) {
        this.id = id ?? this.id
    }

    get colorIdentifier() {
        return this._colorIdentifier
    }

    get collisionUpdated(): boolean {
        return this.__collisionUpdated;
    }

    set collisionUpdated(value: boolean) {
        this.__collisionUpdated = value;
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

    clone():EditorEntity{
        return EditorEntityManager.clone(this)
    }

    setParent(parent: EngineEntity|undefined) {
        EntityManager.addParent(this.id, parent)
    }

    addComponent<T>(comp: Components): T {
        return EntityManager.addComponent(this.id, comp) as T
    }

    addParent(id: EngineEntity){
        EntityManager.addParent(this.id, id)
    }

    removeComponent(key: Components) {
        EntityManager.removeComponent(this.id, key)
    }
}
