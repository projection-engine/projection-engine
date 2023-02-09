import type Entity from "../../engine-core/instances/Entity";

export default interface LevelFile {
    entities: Entity[],
    entity: Entity
}