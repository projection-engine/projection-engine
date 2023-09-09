import GPUState from "../../states/GPUState"
import EngineState from "../../states/EngineState";
import AbstractMesh from "@engine-core/lib/resources/AbstractMesh";

export default class Mesh extends AbstractMesh {
    bindEssentialResources() {
        const last = GPUState.activeMesh
        if (last === this)
            return
        GPUState.activeMesh = this
        GPUState.context.bindVertexArray(this.VAO)
        GPUState.context.bindBuffer(GPUState.context.ELEMENT_ARRAY_BUFFER, this.indexVBO)
        this.vertexVBO.enable()
    }

    simplifiedDraw() {

        this.bindEssentialResources()
        GPUState.context.drawElements(GPUState.context.TRIANGLES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
        this.lastUsed = EngineState.elapsed
    }

    draw() {
        this.bindAllResources()
        GPUState.context.drawElements(GPUState.context.TRIANGLES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
        this.lastUsed = EngineState.elapsed
    }

    drawInstanced(quantity) {
        this.bindAllResources()
        GPUState.context.drawElementsInstanced(GPUState.context.TRIANGLES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0, quantity)
        this.lastUsed = EngineState.elapsed
    }

    drawLineLoop() {
        this.bindEssentialResources()
        GPUState.context.drawElements(GPUState.context.LINE_LOOP, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
        this.lastUsed = EngineState.elapsed
    }

    drawTriangleStrip() {
        this.bindEssentialResources()
        GPUState.context.drawElements(GPUState.context.TRIANGLE_STRIP, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
        this.lastUsed = EngineState.elapsed
    }

    drawTriangleFan() {
        this.bindEssentialResources()
        GPUState.context.drawElements(GPUState.context.TRIANGLE_FAN, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
        this.lastUsed = EngineState.elapsed
    }

    drawLines() {
        this.bindEssentialResources()
        GPUState.context.drawElements(GPUState.context.LINES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
        this.lastUsed = EngineState.elapsed
    }
}
