import {Components,} from "@engine-core/engine.enum";


export default abstract class Component implements IComponent{
    abstract getDependencies(): Components[]

    #entity: EngineEntity
    get entity() {
        return this.#entity
    }

    constructor(entity: EngineEntity) {
        this.#entity = entity
    }

    abstract getComponentKey(): Components

    onUpdate = () =>  {}

}
