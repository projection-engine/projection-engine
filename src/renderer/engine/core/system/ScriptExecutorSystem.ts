import AbstractSystem from "../AbstractSystem";
import Engine from "../Engine";
import ScriptsAPI from "../lib/utils/ScriptsAPI";
import MetricsController from "../lib/utils/MetricsController";
import METRICS_FLAGS from "../static/METRICS_FLAGS";

export default class ScriptExecutorSystem extends AbstractSystem{
    shouldExecute(): boolean {
        return !Engine.isDev && ScriptsAPI.mountedScripts.length > 0;
    }

    execute() {
        const scripts = ScriptsAPI.mountedScripts
        const size = scripts.length
        for (let i = 0; i < size; i++) {
            try {
                const script = scripts[i]
                if (script.onUpdate)
                    script.onUpdate()
            } catch (err) {
                console.error(err)
            }
        }
        MetricsController.currentState = METRICS_FLAGS.SCRIPT
    }
}
