import {expect, test} from '@jest/globals';
import EntityManager from "@engine-core/managers/EntityManager";
import uuid from "uuidv4";
import {Components} from "@engine-core/engine.enum";
import UIComponent from "@engine-core/lib/components/UIComponent";
import {vec3} from "gl-matrix";

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
    const component = EntityManager.addComponent(id, Components.UI)
    const TEST_VALUE = "TEST_VALUE";
    EntityManager.updateProperty(id, Components.UI, "uiLayoutID", TEST_VALUE)
    expect(eventTriggered).toStrictEqual(true);
    expect((component as UIComponent).uiLayoutID).toStrictEqual(TEST_VALUE);
});

test('Should not generate picker id', () => {
    createEntity()
    const id = EntityManager.getEntityKeys()[0]
    const pickerGenerated = EntityManager.getEntityPickVec3(id)

    expect(pickerGenerated).toStrictEqual(vec3.fromValues(0, 0, 0));
});

test('Should generate picker id', () => {
    createEntity()
    const id = EntityManager.getEntityKeys()[0]
    EntityManager.addComponent(id, Components.TRANSFORMATION)
    const pickerGenerated = EntityManager.getEntityPickVec3(id)

    expect(Math.round(pickerGenerated[0] * 255)).toStrictEqual(4);
});
