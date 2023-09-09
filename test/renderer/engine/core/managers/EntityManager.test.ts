import {expect, test} from '@jest/globals';
import EntityManager from "@engine-core/managers/EntityManager";
import uuid from "uuidv4";
import {Components} from "@engine-core/engine.enum";

beforeEach(() => EntityManager.get());

function createEntity(ids = [uuid()]) {
    EntityManager.createEntitiesById(ids as EngineEntity[])
    return ids
}

test('Should trigger create event', () => {
    let eventTriggered = false
    EntityManager.addEventListener("create", () => eventTriggered = true)
    const created = createEntity()
    expect(eventTriggered).toStrictEqual(true);
    expect(EntityManager.getEntityKeys()).toStrictEqual(created);
});

test('Should trigger delete event', () => {
    let eventTriggered = false
    EntityManager.addEventListener("delete", () => eventTriggered = true)
    createEntity()
    EntityManager.removeEntities(EntityManager.getEntityKeys())
    expect(eventTriggered).toStrictEqual(true);
    expect(EntityManager.getEntityKeys()).toStrictEqual([]);
});

test('Should trigger component-add event', () => {
    let eventTriggered = false
    EntityManager.addEventListener("component-add", () => eventTriggered = true)
    createEntity()
    const id = EntityManager.getEntityKeys()[0];
    EntityManager.addComponent(id, Components.UI)
    expect(eventTriggered).toStrictEqual(true);
    expect(EntityManager.getAllComponents(id).length).toStrictEqual(1);
});

test('Should trigger component-remove event', () => {
    let eventTriggered = false
    EntityManager.addEventListener("component-remove", () => eventTriggered = true)
    createEntity()
    const id = EntityManager.getEntityKeys()[0]
    EntityManager.addComponent(id, Components.UI)
    EntityManager.removeComponent(id, Components.UI)
    expect(eventTriggered).toStrictEqual(true);
    expect(EntityManager.getAllComponents(id)).toStrictEqual([]);
});

test('Should trigger update event', () => {
    let eventTriggered = false
    EntityManager.addEventListener("update", () => eventTriggered = true)
    createEntity()
    const id = EntityManager.getEntityKeys()[0]
    EntityManager.addComponent(id, Components.UI)
    EntityManager.updateProperty(id, Components.UI, "uiLayoutID", "TEST_KEY")
    expect(eventTriggered).toStrictEqual(true);
});
