import * as shaderCode from "../shaders/GRID.glsl"
import ShaderInstance from "../../engine/libs/instances/ShaderInstance"
import QuadInstance from "../../engine/libs/instances/QuadInstance"

export default class GridSystem {
    constructor() {
        this.gridShader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment)
        this.grid = new QuadInstance()
    }

    execute(options) {
        const {
            gridVisibility,
            camera
        } = options
        if(gridVisibility && !camera.ortho) {
            this.gridShader.use()
            this.gridShader.bindForUse({
                viewMatrix:  camera.viewMatrix,
                projectionMatrix: camera.projectionMatrix,
                gamma: camera.gamma,
                exposure: camera.exposure
            })

            this.grid.draw()
        }
    }
}