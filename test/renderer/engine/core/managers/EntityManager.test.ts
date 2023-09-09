import {expect, test} from '@jest/globals';
import EntityManager from "@engine-core/managers/EntityManager";
import uuid from "uuidv4";

test('Should create entity and return key', () => {
    EntityManager.get()
    const id = uuid() as EngineEntity
    EntityManager.createEntitiesById([id])
    expect(EntityManager.getEntityKeys()).toStrictEqual([id]);
});
