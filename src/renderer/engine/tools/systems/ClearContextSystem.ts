import AbstractSystem from "../../core/AbstractSystem";
import GPUState from "@engine-core/states/GPUState";

export default class ClearContextSystem extends AbstractSystem{
     execute = () => {
        const context = GPUState.context
        context.clear(context.DEPTH_BUFFER_BIT)
        context.disable(context.CULL_FACE)
        context.disable(context.DEPTH_TEST)
    }
}
