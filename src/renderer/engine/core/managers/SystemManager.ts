import AbstractSingleton from "../AbstractSingleton";
import DynamicMap from "../lib/DynamicMap";
import AbstractSystem from "../AbstractSystem";
import {UUID} from "crypto";
import PhysicsSystem from "../system/PhysicsSystem";
import EngineState from "../states/EngineState";

export default class SystemManager extends AbstractSingleton {
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
        this.#frameId = requestAnimationFrame(this.#loop)
    }

    stop() {
        cancelAnimationFrame(this.#frameId)
        this.#frameId = undefined
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
