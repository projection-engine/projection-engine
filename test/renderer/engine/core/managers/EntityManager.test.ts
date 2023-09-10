import {expect, test} from '@jest/globals';
import EntityManager from "@engine-core/managers/EntityManager";
import uuid from "uuidv4";
import {Components} from "@engine-core/engine.enum";
import UIComponent from "@engine-core/lib/components/UIComponent";
import {vec3} from "gl-matrix";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";

beforeEach(() => EntityManager.get());

function createEntity(ids = [uuid()]): EngineEntity[] {
    EntityManager.createEntitiesById(ids as EngineEntity[])
    return ids as EngineEntity[]
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

test('Should be child in parent list', () => {
    const created = createEntity([uuid(), uuid(), uuid()])
    EntityManager.addChildren(created[0], [created[1]])
    EntityManager.addParent(created[0], created[2])
    expect(EntityManager.getParent(created[0])).toStrictEqual(created[2]);
    expect(EntityManager.getParent(created[1])).toStrictEqual(created[0]);
    expect(EntityManager.getChildren(created[0])).toContain(created[1]);
});

test('Should not be child in parent list', () => {
    const created = createEntity([uuid(), uuid()])
    EntityManager.addChildren(created[0], [created[1]])
    EntityManager.addParent(created[1], undefined)
    expect(EntityManager.getChildren(created[0]).length).toEqual(0)
    expect(EntityManager.getParent(created[1])).toEqual(undefined)
});

test('Should trigger hierarchy change', () => {
    const created = createEntity([uuid(), uuid()])
    let eventTriggered = 0
    EntityManager.debounceEvents = false
    EntityManager.addEventListener("hierarchy-change", () => eventTriggered++)

    EntityManager.addChildren(created[0], [created[1]])
    EntityManager.addParent(created[1], undefined)

    expect(eventTriggered).toEqual(2)
});

test('Should add to withComponent', () => {
    const id = createEntity()[0]
    EntityManager.debounceEvents = false
    EntityManager.addComponent(id, Components.TRANSFORMATION)
    expect(EntityManager.withComponent(Components.TRANSFORMATION).array).toContain(id)
});

async function callMultipleTimes() {
    const id = createEntity()[0]
    let eventTriggered = 0
    await new Promise(resolve => {
        let timeout
        EntityManager.addEventListener("component-add", () => {
            clearTimeout(timeout)
            eventTriggered++
            timeout = setTimeout(() => resolve(null), 100)
        })
        EntityManager.addComponent(id, Components.TRANSFORMATION)
        EntityManager.addComponent(id, Components.UI)
        EntityManager.addComponent(id, Components.SPRITE)
        EntityManager.addComponent(id, Components.DECAL)
    })
    return eventTriggered
}

test('Should not debounce events', async () => {
    EntityManager.debounceEvents = false
    const eventTriggered = await callMultipleTimes()
    expect(eventTriggered).toEqual(4)
});

test('Should debounce events', async () => {
    const eventTriggered = await callMultipleTimes()
    expect(eventTriggered).toEqual(1)
});

test('Should clone entity with components', () => {
    const created = createEntity()
    let eventTriggered = false
    EntityManager.addEventListener("create", () => eventTriggered = true)
    EntityManager.addComponent(created[0], Components.TRANSFORMATION)
    const TC = EntityManager.getComponent<TransformationComponent>(created[0], Components.TRANSFORMATION)
    TC.translation[0] = 255
    const newClone = EntityManager.clone(created[0])
    const cloneTC = EntityManager.getComponent<TransformationComponent>(newClone, Components.TRANSFORMATION)

    expect(eventTriggered).toEqual(true)
    expect(cloneTC).toBeDefined()
    expect(cloneTC.translation).toBeInstanceOf(Float32Array)
    expect(cloneTC.translation).toEqual(TC.translation)
});

