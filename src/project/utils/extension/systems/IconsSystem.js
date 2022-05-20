import System from "../../../engine/basic/System";
import pointLightIcon from "../icons/point_light.png";
import directionalLightIcon from "../icons/directional_light.png";
import spotLightIcon from "../icons/spot_light.png";
import cubeMapIcon from "../icons/cubemap.png";
import probeIcon from "../icons/probe.png";
import TextureInstance from "../../../engine/instances/TextureInstance";
import BillboardsInstance from "../BillboardsInstance";
import * as shaderCode from '../shaders/gizmo.glsl'
import ShaderInstance from "../../../engine/instances/ShaderInstance";
import COMPONENTS from "../../../engine/templates/COMPONENTS";
import MeshInstance from "../../../engine/instances/MeshInstance";
import camera from "../../../../static/assets/Camera.json";

export default class IconsSystem extends System {
    _ready = false

    constructor(gpu) {
        super([]);
        this.gpu = gpu
        this.billboardRenderer = new BillboardsInstance(gpu)
        this.cameraShader = new ShaderInstance(shaderCode.shadedVertex, shaderCode.shadedFragment, gpu)
        this.cameraMesh = new MeshInstance({
            gpu,
            vertices: camera.vertices,
            indices: camera.indices,
            normals: camera.normals,
            uvs: [],
            tangents: [],
        })

        this.pointLightTexture = new TextureInstance(pointLightIcon, false, this.gpu)
        this.directionalLightTexture = new TextureInstance(directionalLightIcon, false, this.gpu)
        this.spotLightTexture = new TextureInstance(spotLightIcon, false, this.gpu)
        this.cubemapTexture = new TextureInstance(cubeMapIcon, false, this.gpu)
        this.probeTexture = new TextureInstance(probeIcon, false, this.gpu)
    }

    loop(ref, comp, key){
        const result = []
        const size = ref.length

        for(let i = 0; i< size; i++){
            result.push(ref[i].components[comp][key])
        }

        return result
    }

    execute(data, options) {
        super.execute()
        const {
            pointLights,
            spotLights,
            directionalLights,
            cubeMaps,
            skylight,
            cameras,
            lightProbes
        } = data
        const {

            camera,
            iconsVisibility,
            iconSize,

        } = options



            if (iconsVisibility) {
                const mapped = {
                    pointLights: this.loop(pointLights, COMPONENTS.TRANSFORM, 'transformationMatrix'),
                    directionalLights: this.loop(directionalLights, COMPONENTS.DIRECTIONAL_LIGHT, 'transformationMatrix'),

                    cubemaps: this.loop(cubeMaps, COMPONENTS.TRANSFORM, 'transformationMatrix'),
                    probes: this.loop(lightProbes, COMPONENTS.TRANSFORM, 'transformationMatrix'),
                }

                this.billboardRenderer.draw(mapped.pointLights, this.pointLightTexture.texture, camera, iconSize)
                this.billboardRenderer.draw(mapped.directionalLights, this.directionalLightTexture.texture, camera, iconSize)
                if (skylight)
                    this.billboardRenderer.draw([skylight.transformationMatrix], this.directionalLightTexture.texture, camera, iconSize)
                this.billboardRenderer.draw(mapped.cubemaps, this.cubemapTexture.texture, camera, iconSize)
                this.billboardRenderer.draw(mapped.probes, this.probeTexture.texture, camera, iconSize)

                this.cameraShader.use()
                this.gpu.bindVertexArray(this.cameraMesh.VAO)
                this.gpu.bindBuffer(this.gpu.ELEMENT_ARRAY_BUFFER, this.cameraMesh.indexVBO)
                this.cameraMesh.vertexVBO.enable()
                this.cameraMesh.normalVBO.enable()

                for (let i = 0; i < cameras.length; i++) {

                    this.cameraShader.bindForUse({
                        viewMatrix: camera.viewMatrix,
                        transformMatrix: cameras[i].components[COMPONENTS.TRANSFORM].transformationMatrix,
                        projectionMatrix: camera.projectionMatrix,
                        axis: 3,
                        selectedAxis: 0
                    })
                    this.gpu.drawElements(this.gpu.TRIANGLES, this.cameraMesh.verticesQuantity, this.gpu.UNSIGNED_INT, 0)
                }
                this.cameraMesh.vertexVBO.disable()
                this.cameraMesh.normalVBO.disable()

            }

        this.gpu.bindVertexArray(null)
    }

}