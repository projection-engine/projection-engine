import {expect, test} from '@jest/globals';
import EntityManager from "@engine-core/managers/EntityManager";
import uuid from "uuidv4";
import {Components} from "@engine-core/engine.enum";
import UIComponent from "@engine-core/lib/components/UIComponent";
import {vec3} from "gl-matrix";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import SystemManager from "@engine-core/managers/SystemManager";
import AbstractSystem from "@engine-core/AbstractSystem";
import MetricsManager from "@engine-core/managers/MetricsManager";

beforeEach(() => {
    SystemManager.get()
    const start = performance.now()
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
        const timeout = setTimeout(() => cb(performance.now() - start), 50)
        // @ts-ignore
        return timeout as number
    }
    global.cancelAnimationFrame = id => clearTimeout(id)

});
afterEach(() => SystemManager.destroy());

class ExampleSystem extends AbstractSystem {
    static executed = false

    execute() {
        ExampleSystem.executed = true
    }
}

test('Should include system', () => {
    const ins = SystemManager.getInstance()
    ins.enableSystem(ExampleSystem)
    expect(ins.hasSystem(ExampleSystem)).toBe(true);
    expect(ins.isSystemEnabled(ExampleSystem)).toBe(true);
});

test('Should not include system', () => {
    const ins = SystemManager.getInstance()
    ins.enableSystem(ExampleSystem)
    ins.disableSystem(ExampleSystem)
    expect(ins.hasSystem(ExampleSystem)).toBe(true);
    expect(ins.isSystemEnabled(ExampleSystem)).toBe(false);
});

test('Should execute system', async () => {
    const ins = SystemManager.getInstance()
    ins.enableSystem(ExampleSystem)
    ins.start()
    await new Promise((resolve) => setTimeout(() => resolve(null), 100))
    ins.stop()
    expect(ExampleSystem.executed).toBe(true);
});

test('Should record metrics', async () => {
    const ins = SystemManager.getInstance()

    ins.enableSystem(ExampleSystem)
    MetricsManager.start()
    ins.start()
    await new Promise((resolve) => setTimeout(() => resolve(null), 100))
    ins.stop()

    const record = MetricsManager.getRecord()
    expect(record[0].flag).toBe(ExampleSystem.get().constructor.name);
});
