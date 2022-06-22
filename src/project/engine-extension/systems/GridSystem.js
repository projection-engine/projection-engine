import System from "../../engine/basic/System"
import * as shaderCode from "../shaders/GRID.glsl"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import QuadInstance from "../../engine/instances/QuadInstance"

export default class GridSystem extends System {
    constructor() {
        super()
        this.gridShader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment)
        this.grid = new QuadInstance()
    }

    execute(options) {
        super.execute()
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