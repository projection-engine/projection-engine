import AbstractSingleton from "@engine-core/AbstractSingleton";
import EntityManager from "@engine-core/EntityManager";
import FileSystemAPI from "@engine-core/lib/utils/FileSystemAPI";
import GPU from "@engine-core/GPU";
import GPUAPI from "@engine-core/lib/rendering/GPUAPI";
import {Components} from "@engine-core/engine.enum";
import Component from "@engine-core/components/Component";
import serializeStructure from "@engine-core/utils/serialize-structure";

export default class LevelManager {
    static #loadedLevel: EngineEntity

    static get loadedLevel() {
        return this.#loadedLevel
    }

    static async loadLevel(levelID: EngineEntity, cleanEngine?: boolean) {
        if (!levelID || LevelManager.#loadedLevel === levelID && !cleanEngine)
            return []
        try {
            if (cleanEngine) {
                GPU.meshes.forEach(m => GPUAPI.destroyMesh(m))
                GPU.textures.forEach(m => GPUAPI.destroyTexture(m.id))
                GPU.materials.clear()
            }

            const asset = await FileSystemAPI.readAsset(levelID)
            const {state} = JSON.parse(asset) as EngineLevel<Components, Component>
            this.restoreState(state)
        } catch (err) {
            console.error(err)
        }

    }

    static #replaceLevel(newLevel?: EngineEntity) {
        const oldLevel = LevelManager.#loadedLevel
        LevelManager.#loadedLevel = newLevel
        if (oldLevel) {
            EntityManager.removeEntities([oldLevel])
        }
        if (newLevel)
            EntityManager.createEntitiesById([newLevel])
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

    static serializeState(): string {
        const data = []
        EntityManager.getEntities().forEach((value, key) => {
            data.push({
                id: key,
                components: Array.from(value.entries())
            })
        })
        return serializeStructure({
            entities: data,
            activeEntities: Array.from(EntityManager.getActiveEntities().entries()),
            parentChildren: Array.from(EntityManager.getParentChildren().entries()),
            childParent: Array.from(EntityManager.getChildParent().entries()),
        })
    }
}
