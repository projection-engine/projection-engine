import AbstractSingleton from "./AbstractSingleton";
import DynamicMap from "./resource-libs/DynamicMap";
import AbstractSystem from "./AbstractSystem";
import {UUID} from "crypto";
import PhysicsSystem from "./system/PhysicsSystem";
import ResourceGarbageCollector from "./resource-libs/ResourceGarbageCollector";
import EngineState from "./EngineState";
import Engine from "./Engine";

export default class SystemManager extends AbstractSingleton {
    #executionQueue = new DynamicMap<UUID, AbstractSystem>()
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
        this.#executionQueue.set(ref.getSystemId(), ref)
    }

    disableSystem(system: typeof AbstractSystem) {
        this.#executionQueue.delete(system.get<AbstractSystem>().getSystemId())
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
            queue[i].execute()
        }
        this.#frameId = requestAnimationFrame(this.#loop)
    }

}
