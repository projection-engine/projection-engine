import AbstractSingleton from "./AbstractSingleton";
import DynamicMap from "./resource-libs/DynamicMap";
import AbstractSystem from "./AbstractSystem";
import {UUID} from "crypto";
import PhysicsSystem from "./system/PhysicsSystem";
import ResourceGarbageCollector from "./resource-libs/ResourceGarbageCollector";
import EngineState from "./EngineState";
import Components from "./static/COMPONENTS";
import Entity from "./instances/Entity";
import EntityManager from "./EntityManager";

export default class SystemManager extends AbstractSingleton {

    static injectEntities<T>(component: Components): GenericVoidFunctionWith2P<AbstractSystem, string> {
        return (target: AbstractSystem, propertyKey: string) => {
            const targetField = new DynamicMap<UUID, Entity>()
            EntityManager.getInstance().addEventListener("hard-change", (event) => {
                switch (event.type) {
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
                        if (event.targetComponents.includes(component)) {
                            targetField.set(event.target.id, event.target)
                        }
                        break
                    case "component-remove":
                        if (event.targetComponents.includes(component)) {
                            targetField.delete(event.target.id)
                        }
                        break
                }
                target[propertyKey] = targetField
            }, {targetComponent: component})
        }
    }

    #executionQueue = new DynamicMap<UUID, AbstractSystem>()
    #systems = new Map<UUID, boolean>
    #frameId:number = null

    static getInstance(): SystemManager {
        return super.get<SystemManager>()
    }

    static getExecutionQueue() {
        return SystemManager.getInstance().getExecutionQueue()
    }

    getExecutionQueue() {
        return this.#executionQueue
    }

    enableSystem(system: typeof AbstractSystem) {
        const ref = system.get<AbstractSystem>()
        this.#systems.set(ref.getSystemId(), true)
        this.#executionQueue.set(ref.getSystemId(), ref)
    }

    disableSystem(system: typeof AbstractSystem) {
        const ref = system.get<AbstractSystem>()
        this.#systems.set(ref.getSystemId(), false) 
    }

    isRunning(){
        return this.#frameId != null
    }

    start() {
        PhysicsSystem.start()
        ResourceGarbageCollector.start()
        this.#frameId = requestAnimationFrame(this.#loop)
    }

    stop() {
        cancelAnimationFrame(this.#frameId)
        this.#frameId = undefined
        ResourceGarbageCollector.stop()
        PhysicsSystem.stop()
    }

    #loop(c) {
        const queue = SystemManager.getExecutionQueue().array
        const queueLength = queue.length
        EngineState.currentTimeStamp = c
        for (let i = 0; i < queueLength; i++) {
            const system = queue[i];
            if(system.shouldExecute() && this.#systems.get(system.getSystemId())) {
                system.execute()
            }
        }
        this.#frameId = requestAnimationFrame(this.#loop)
    }

}
