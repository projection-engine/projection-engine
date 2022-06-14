import System from "../../engine/basic/System"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import * as shaderCode from "../shaders/SELECTED.glsl"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import FramebufferInstance from "../../engine/instances/FramebufferInstance"

export default class SelectedSystem extends System {

    constructor(gpu, resolution) {
        super()
        this.gpu = gpu
        this.shaderSilhouette = new ShaderInstance(
            shaderCode.vertexSilhouette,
            shaderCode.fragmentSilhouette,
            gpu
        )
        this.shader = new ShaderInstance(
            shaderCode.vertex,
            shaderCode.fragment,
            gpu
        )
        this.frameBuffer = new FramebufferInstance(gpu, resolution.w, resolution.h)
        this.frameBuffer
            .texture({
                attachment: 0,
                precision: this.gpu.R16F,
                format: this.gpu.RED,
                type: this.gpu.FLOAT
            })
            .depthTest()
    }


    execute(selected, meshSources, camera, entitiesMap) {
        super.execute()
        const length = selected.length
        if (length > 0) {
            this.shader.use()
            this.frameBuffer.startMapping()
            for (let m = 0; m < length; m++) {
                const current = entitiesMap[selected[m]]
                const mesh = meshSources[current.components[COMPONENTS.MESH]?.meshID]
                if (mesh !== undefined) {
                    const t = current.components[COMPONENTS.TRANSFORM]
                    this.drawMesh(
                        mesh,
                        camera.viewMatrix,
                        camera.projectionMatrix,
                        t.transformationMatrix
                    )
                }
            }
            this.frameBuffer.stopMapping()

            this.shaderSilhouette.use()
            this.shaderSilhouette.bindForUse({
                silhouette: this.frameBuffer.colors[0]
            })
            this.frameBuffer.draw()
            this.gpu.bindVertexArray(null)
        }
    }

    drawMesh(
        mesh,
        viewMatrix,
        projectionMatrix,
        transformMatrix
    ) {
        mesh.use()
        this.shader.bindForUse({
            projectionMatrix,
            transformMatrix,
            viewMatrix
        })

        this.gpu.drawElements(this.gpu.TRIANGLES, mesh.verticesQuantity, this.gpu.UNSIGNED_INT, 0)
        mesh.finish()
    }
}