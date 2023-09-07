import AbstractSystem from "../AbstractSystem";
import Engine from "../Engine";
import ScriptsManager from "../managers/ScriptsManager";
import MetricsManager from "../managers/MetricsManager";
import METRICS_FLAGS from "../static/METRICS_FLAGS";

export default class ScriptExecutorSystem extends AbstractSystem{
     shouldExecute = (): boolean =>  {
        return !Engine.isDev && ScriptsManager.mountedScripts.length > 0;
    }

     execute = () => {
        const scripts = ScriptsManager.mountedScripts
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
        MetricsManager.currentState = METRICS_FLAGS.SCRIPT
    }
}
