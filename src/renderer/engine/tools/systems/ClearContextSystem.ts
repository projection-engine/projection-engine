import AbstractSystem from "../../core/AbstractSystem";
import GPU from "../../core/GPU";

export default class ClearContextSystem extends AbstractSystem{
    execute() {
        const context = GPU.context
        context.clear(context.DEPTH_BUFFER_BIT)
        context.disable(context.CULL_FACE)
        context.disable(context.DEPTH_TEST)
    }
}
