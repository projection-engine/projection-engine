import System from "../../engine/basic/System"
import * as shaderCode from "../shaders/grid.glsl"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import Quad from "../../engine/instances/Quad"

export default class GridSystem extends System {
    constructor(gpu) {
        super();
        this.gpu = gpu

        this.gridShader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment, gpu)
        this.grid = new Quad(gpu)
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