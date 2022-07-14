import FramebufferInstance from "../../engine/instances/FramebufferInstance"
import ForwardPass from "../../engine/systems/passes/ForwardPass"
import {mat4} from "gl-matrix"
import MeshInstance from "../../engine/instances/MeshInstance"
import EditorCamera from "../camera/EditorCamera"
import SHADING_MODELS from "../../../static/misc/SHADING_MODELS"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import MaterialInstance from "../../engine/instances/MaterialInstance"

function toBase64( fbo) {
    const gpu = window.gpu
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
    constructor() {
        this.frameBuffer = new FramebufferInstance( SIZE, SIZE)
        this.frameBuffer
            .texture({precision: window.gpu.RGBA32F, format: window.gpu.RGBA, type: window.gpu.FLOAT})

        import("../../../static/meshes/Sphere.json").then(res => {
            this.sphereMesh = new MeshInstance(res)
        })
        this.cameraData = EditorCamera.update(0, RADIAN_90, 2.5, [0,0,0])
        this.projection = mat4.perspective([], RADIAN_60, 1, .1, 10000)
        this.pointLightData =[
            [
                0, 0, 10, 0,
                1, 1, 1, 0,
                .5, 0, 0, 0,
                100, .1, 0, 0
            ],
            [
                0, 0, -10, 0,
                1, 1, 1, 0,
                .5, 0, 0, 0,
                100, .1, 0, 0
            ]
        ]
    }

    execute(options, data, materialMesh, meshEntity) {
        const {
            elapsed,
            brdf,
            fallbackMaterial
        } = options
        let response
        this.frameBuffer.startMapping()



        if(meshEntity && materialMesh instanceof MeshInstance){
            const maxX = materialMesh.maxBoundingBox[0] - materialMesh.minBoundingBox[0],
                maxY = materialMesh.maxBoundingBox[1] - materialMesh.minBoundingBox[1],
                maxZ = materialMesh.maxBoundingBox[2] - materialMesh.minBoundingBox[2]
            const radius = Math.max(maxX, maxY, maxZ)
            const cam = EditorCamera.update(0, RADIAN_90, radius + 2, meshEntity.components[COMPONENTS.TRANSFORM].translation)
            const transformMatrix =meshEntity.components[COMPONENTS.TRANSFORM].transformationMatrix
            const pointLightData = [[
                0, meshEntity.components[COMPONENTS.TRANSFORM].translation[1]/2, radius * 10, 0,
                1, 1, 1, 0,
                .5, 0, 0, 0,
                100, .1, 0, 0
            ],
            [
                0, meshEntity.components[COMPONENTS.TRANSFORM].translation[1]/2, -radius * 10, 0,
                1, 1, 1, 0,
                .5, 0, 0, 0,
                100, .1, 0, 0
            ]]

            ForwardPass.drawMesh({
                mesh: materialMesh,
                camPosition: cam[1],
                viewMatrix: cam[0],
                projectionMatrix: this.projection,
                transformMatrix,
                material: fallbackMaterial,
                normalMatrix: this.identity,
                brdf,
                directionalLightsQuantity: 0,
                directionalLightsData: [],
                dirLightPOV: [],
                pointLightsQuantity: 2,
                pointLightData: pointLightData,
                materialComponent: {},
                elapsed,
                ambient: {},

                shadingModel: SHADING_MODELS.NORMAL,
                useCubeMapShader: true
            })
            materialMesh.finish()
        }
        else if (materialMesh instanceof MaterialInstance){
            const [ viewMatrix, camPosition ] = this.cameraData
            ForwardPass.drawMesh({
                mesh: this.sphereMesh,
                camPosition,
                viewMatrix,
                projectionMatrix: this.projection,
                transformMatrix: this.identity,
                material: materialMesh,
                normalMatrix: this.identity,
                brdf,
                directionalLightsQuantity: 0,
                directionalLightsData: [],
                dirLightPOV: [],
                pointLightsQuantity: 2,
                pointLightData: this.pointLightData,
                materialComponent: {},
                elapsed,
                ambient: {},

                shadingModel: SHADING_MODELS.NORMAL,
                useCubeMapShader: true
            })
        }
        this.frameBuffer.stopMapping()
        response= toBase64(this.frameBuffer)
        this.sphereMesh.finish()
        window.gpu.bindVertexArray(null)
        return response
    }
}

