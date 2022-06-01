import FramebufferInstance from "../../engine/instances/FramebufferInstance"
import ForwardSystem from "../../engine/systems/ForwardSystem"
import {mat4} from "gl-matrix"
import MeshInstance from "../../engine/instances/MeshInstance"
import EditorCamera from "../camera/EditorCamera"
import SHADING_MODELS from "../../engine/templates/SHADING_MODELS"

function toBase64(gpu, fbo) {
    const canvas = document.createElement("canvas")
    canvas.width = SIZE
    canvas.height = SIZE
    const context = canvas.getContext("2d")
    const width =SIZE, height =SIZE
    gpu.bindFramebuffer(gpu.FRAMEBUFFER, fbo.FBO)
    let data = new Float32Array(width * height * 4)
    gpu.readPixels(0, 0, width, height, gpu.RGBA, gpu.FLOAT, data)
    for(let i =0; i < data.length;  i += 4){
        data[i] *= 255
        data[i + 1] *= 255
        data[i + 2] *= 255
        data[i + 3] = 255
    }

    let imageData = context.createImageData(width, height)
    imageData.data.set(data)
    context.putImageData(imageData, 0, 0)
    gpu.bindFramebuffer(gpu.FRAMEBUFFER, null)
    data =canvas.toDataURL()

    return data
}

const SIZE = 300, RADIAN_60 =1.0472, RADIAN_90=1.57
export default class PreviewSystem {
    identity = mat4.create()
    constructor(gpu) {

        this.gpu = gpu
        this.frameBuffer = new FramebufferInstance(gpu, SIZE, SIZE)
        this.frameBuffer
            .texture({precision: this.gpu.RGBA32F, format: this.gpu.RGBA, type: this.gpu.FLOAT})

        import("../../../static/assets/Sphere.json").then(res => {
            this.sphereMesh = new MeshInstance({
                ...(res),
                gpu
            })
        })
        this.cameraData = EditorCamera.update(0, RADIAN_90, 2.5, [0,0,0])
        this.projection = mat4.perspective([], RADIAN_60, 1, .1, 10000)
        this.pointLightData =[
            0, 0, 10, 0,
            1, 1, 1, 0,
            .9, 0, 0, 0,
            100, .1, 0, 0
        ]
    }

    execute(options, data, material) {
        const {
            elapsed,
            brdf
        } = options
        let response
        this.frameBuffer.startMapping()
        const [ viewMatrix, camPosition ] = this.cameraData
        ForwardSystem.drawMesh({
            mesh:this.sphereMesh,
            camPosition,
            viewMatrix,
            projectionMatrix: this.projection,
            transformMatrix: this.identity,
            material,
            normalMatrix: this.identity,
            brdf,
            directionalLightsQuantity: 0,
            directionalLightsData: [],
            dirLightPOV: [],
            pointLightsQuantity: 1,
            pointLightData: [this.pointLightData],
            materialComponent: {},
            elapsed,
            ambient: {irradianceMultiplier: [1,1,1]},

            gpu: this.gpu,
            shadingModel: SHADING_MODELS.NORMAL,
            useCubeMapShader: true
        })

        this.frameBuffer.stopMapping()
        response= toBase64(this.gpu, this.frameBuffer)
        this.sphereMesh.finish()
        this.gpu.bindVertexArray(null)
        return response
    }
}

