// @ts-ignore
global.window = {require: require}

import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EngineToolsState from "../../../../../src/renderer/engine/tools/state/EngineToolsState";
import {expect, test} from '@jest/globals';
import EntityManager from "@engine-core/managers/EntityManager";
import uuid from "uuidv4";
import EditorEntityManager from "../../../../../src/renderer/engine/tools/managers/EditorEntityManager";
import EditorEntity from "../../../../../src/renderer/engine/tools/EditorEntity";
import {Components} from "@engine-core/engine.enum";
import GizmoManager from "../../../../../src/renderer/engine/tools/managers/GizmoManager";
import GizmoState from "../../../../../src/renderer/engine/tools/state/GizmoState";


beforeEach(() => {
    EditorEntityManager.get()
    EntityManager.get()

});
afterEach(() => EntityManager.destroy());

function createEntity(id = uuid()): EditorEntity {
    const entity = EditorEntityManager.create(id as EngineEntity);
    entity.addComponent(Components.TRANSFORMATION)
    return entity
}

test('Should translate', () => {
    const entity = createEntity()
    const ACCELERATION = 1
    GizmoState.mainEntity = entity
    EngineToolsState.selected = [entity]
    GizmoManager.translate([ACCELERATION, 0, 0], false, false, false)
    GizmoManager.translate([ACCELERATION * 2, 0, 0], false, false, false)
    GizmoManager.translate([ACCELERATION * 3, 0, 0], false, false, false)
    const tComp = entity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
    expect(tComp.translation).toStrictEqual(new Float32Array([ACCELERATION * 3, 0, 0]));
});
