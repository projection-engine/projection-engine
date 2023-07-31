import AbstractSingleton from "./AbstractSingleton";
import Components from "./static/COMPONENTS";
import {UUID} from "crypto";
import EntityManager from "./EntityManager";
import type Entity from "./instances/Entity";
import DynamicMap from "./resource-libs/DynamicMap";

export default abstract class AbstractSystem extends AbstractSingleton {
    readonly #id: UUID

    static injectComponents<T>(component: Components): GenericVoidFunctionWith2P<AbstractSystem, string> {
        return (target: AbstractSystem, propertyKey: string) => {
            const targetField = new DynamicMap<UUID, Entity>()
            EntityManager.getInstance().addEventListener("hard-change", (event) => {
                switch (event.type){
                    case "delete": {
                        const withComponent = event.all.filter(e => e.components.has(component))
                        targetField.removeBlock(withComponent, e => e.id)
                        break
                    }
                    case "create": {
                        const withComponent = event.all.filter(e => e.components.has(component))
                        targetField.addBlock(withComponent, e => e.id)
                        break
                    }
                    case "component-add":
                        if(event.targetComponents.includes(component)) {
                            targetField.set(event.target.id, event.target)
                        }
                        break
                    case "component-remove":
                        if(event.targetComponents.includes(component)) {
                            targetField.delete(event.target.id)
                        }
                        break
                }
                target[propertyKey] = targetField
            }, {targetComponent: component})
        }
    }

    protected constructor() {
        super();
        this.#id = crypto.randomUUID()
    }

    abstract execute()

    getSystemId() {
        return this.#id
    }

    // @AbstractSystem.injectComponents<MeshComponent>(MeshComponent.componentKey)
    // example:DynamicMap<UUID, Entity>
}
