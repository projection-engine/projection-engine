import * as shaderCode from "../templates/GRID.glsl"
import ShaderInstance from "../../engine/libs/instances/ShaderInstance"
import QuadInstance from "../../engine/libs/instances/QuadInstance"
import RendererController from "../../engine/RendererController";
import CameraAPI from "../../engine/libs/apis/CameraAPI";

export default class GridSystem {
    constructor() {
        this.gridShader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment)
        this.grid = new QuadInstance()
    }

    execute() {

        if (RendererController.params.gridVisibility && !CameraAPI.isOrthographic) {
            this.gridShader.use()
            this.gridShader.bindForUse({
                viewMatrix: CameraAPI.viewMatrix,
                projectionMatrix: CameraAPI.projectionMatrix,
                gamma: CameraAPI.metadata.gamma,
                exposure: CameraAPI.metadata.exposure
            })

            this.grid.draw()
        }
    }
}