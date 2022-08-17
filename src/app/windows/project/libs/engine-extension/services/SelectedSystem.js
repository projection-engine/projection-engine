import ShaderInstance from "../../engine/libs/instances/ShaderInstance"
import * as shaderCode from "../templates/shaders/SELECTED.glsl"
import COMPONENTS from "../../engine/data/COMPONENTS"
import FramebufferInstance from "../../engine/libs/instances/FramebufferInstance"
import Renderer from "../../engine/Renderer";

export default class SelectedSystem {

    constructor(resolution) {
        this.shaderSilhouette = new ShaderInstance(
            shaderCode.vertexSilhouette,
            shaderCode.fragmentSilhouette
        )
        this.shader = new ShaderInstance(
            shaderCode.vertex,
            shaderCode.fragment
        )
        const TEXTURE = {
            precision: gpu.R16F,
            format: gpu.RED,
            type: gpu.FLOAT
        }
        this.frameBuffer = new FramebufferInstance(resolution.w, resolution.h).texture(TEXTURE)
    }

    drawToBuffer(selected, camera){
        const length = selected.length
        if (length === 0)
            return
        gpu.disable(gpu.DEPTH_TEST)
        this.shader.use()
        this.frameBuffer.startMapping()
        for (let m = 0; m < length; m++) {
            const current = Renderer.entitiesMap.get(selected[m])
            if (!current || !current.active)
                continue
            const mesh = Renderer.meshes.get(current.components[COMPONENTS.MESH]?.meshID)
            if (!mesh)
                continue
            const t = current.components[COMPONENTS.TRANSFORM]
            gpu.bindVertexArray(mesh.VAO)
            gpu.bindBuffer(gpu.ELEMENT_ARRAY_BUFFER, mesh.indexVBO)

            mesh.vertexVBO.enable()
            this.shader.bindForUse({
                projectionMatrix: camera.projectionMatrix,
                transformMatrix: t.transformationMatrix,
                viewMatrix: camera.viewMatrix
            })

            gpu.drawElements(gpu.TRIANGLES, mesh.verticesQuantity, gpu.UNSIGNED_INT, 0)
        }
        this.frameBuffer.stopMapping()
        gpu.bindVertexArray(null)
        gpu.enable(gpu.DEPTH_TEST)
    }
    drawSilhouette(selected) {
        const length = selected.length
        if (length > 0) {
            this.shaderSilhouette.use()
            this.shaderSilhouette.bindForUse({
                silhouette: this.frameBuffer.colors[0]
            })
            this.frameBuffer.draw()
            gpu.bindVertexArray(null)
        }
    }

    #drawMesh(
        mesh,
        viewMatrix,
        projectionMatrix,
        transformMatrix
    ) {

    }
}