import EntityManager from "@engine-core/managers/EntityManager";
import EngineFileSystemManager from "@engine-core/managers/EngineFileSystemManager";
import GPUState from "@engine-core/states/GPUState";
import GPUManager from "@engine-core/managers/GPUManager";
import {Components} from "@engine-core/engine.enum";
import Component from "@engine-core/lib/components/Component";
import serializeStructure from "@engine-core/utils/serialize-structure";

export default class LevelManager {
    static #loadedLevel: string

    static get loadedLevel() {
        return this.#loadedLevel
    }

    static async loadLevel(levelID: string, cleanEngine?: boolean) {
        if (!levelID || LevelManager.#loadedLevel === levelID && !cleanEngine)
            return []
        try {
            if (cleanEngine) {
                GPUState.meshes.forEach(m => GPUManager.destroyMesh(m))
                GPUState.textures.forEach(m => GPUManager.destroyTexture(m.id))
                GPUState.materials.clear()
            }

            const asset = await EngineFileSystemManager.readAsset(levelID)
            if(asset != null) {
                const {engineState} = JSON.parse(asset) as EngineLevel<Components, Component>
                if(!engineState)
                    return
                this.restoreState(JSON.parse(engineState))
            }
        } catch (err) {
            console.error(err)
        }

    }

    static restoreState(data: EngineState<Components, Component>) {
        try {
            EntityManager.clear()
            EntityManager.delayedOperation(() => {
                for (let i = 0; i < data.entities.length; i++) {
                    EntityManager.parseEntity(data[i]);
                }
                EntityManager.clearPickingCache()
                for (let i = 0; i < data.parentChildren.length; i++) {
                    const e = data.parentChildren[i];
                    EntityManager.getParentChildren().set(e[0], e[1])
                }
                for (let i = 0; i < data.childParent.length; i++) {
                    const e = data.childParent[i];
                    EntityManager.getChildParent().set(e[0], e[1])
                }
                for (let i = 0; i < data.activeEntities.length; i++) {
                    const e = data.activeEntities[i];
                    EntityManager.getActiveEntities().set(e[0], e[1])
                }
                return [{all: data.entities.map(e => e.id), type: "create"}]
            })
        } catch (err) {
            EntityManager.clear()
            console.error(err)
        }
    }

    static serializeState(): { engineState: string } {
        const data = []
        EntityManager.getEntities().forEach((value, key) => {
            data.push({
                id: key,
                components: Array.from(value.entries())
            })
        })
        return {
            engineState: serializeStructure({
                entities: data,
                activeEntities: Array.from(EntityManager.getActiveEntities().entries()),
                parentChildren: Array.from(EntityManager.getParentChildren().entries()),
                childParent: Array.from(EntityManager.getChildParent().entries()),
            })
        }
    }
}
