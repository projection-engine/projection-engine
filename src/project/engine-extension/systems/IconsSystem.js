import System from "../../engine/basic/System"
import TextureInstance from "../../engine/instances/TextureInstance"
import Icon from "../Icon"
import * as cameraShaderCode from "../shaders/GIZMO.glsl"
import * as iconShaderCode from "../shaders/ICON.glsl"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import MeshInstance from "../../engine/instances/MeshInstance"
import {fragmentForward, vertex} from "../../engine/shaders/mesh/FALLBACK.glsl"
import {createVAO} from "../../engine/utils/utils"
import VBOInstance from "../../engine/instances/VBOInstance"
import ImageProcessor from "../../engine/utils/image/ImageProcessor"
import {cursorFragment} from "../shaders/ICON.glsl"
const PLANE =  new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0])
export default class IconsSystem extends System {
    #ready = false

    constructor(gpu) {
        super()
        this.gpu = gpu
        this.renderers = {
            pLight: new Icon(gpu),
            dLight: new Icon(gpu),
            cubeMap: new Icon(gpu),
            probe: new Icon(gpu)
        }

        this.iconShader = new ShaderInstance(iconShaderCode.vertex, iconShaderCode.fragment, gpu)
        this.cameraShader = new ShaderInstance(cameraShaderCode.shadedVertex, cameraShaderCode.shadedFragment, gpu)
        this.sphereShader = new ShaderInstance(vertex, fragmentForward, gpu)
        this.cursorShader = new ShaderInstance(iconShaderCode.cursorVertex, iconShaderCode.cursorFragment, gpu)

        this.vao = createVAO(gpu)
        this.vertexVBO = new VBOInstance(gpu, 0, PLANE, gpu.ARRAY_BUFFER, 3, gpu.FLOAT, false)

        Promise.all([
            import("../../../static/icons/point_light.png"),
            import("../../../static/icons/directional_light.png"),
            import("../../../static/icons/cubemap.png"),
            import("../../../static/icons/probe.png"),
            import("../../../static/meshes/Camera.json"),
            import("../../../static/meshes/Sphere.json"),
        ]).then(res => {
            const [pl, dl, cm, p, camera, sphere] = res
            this.pointLightTexture = new TextureInstance(pl.default, false, this.gpu)
            this.directionalLightTexture = new TextureInstance(dl.default, false, this.gpu)
            this.cubemapTexture = new TextureInstance(cm.default, false, this.gpu)
            this.probeTexture = new TextureInstance(p.default, false, this.gpu)
            this.cameraMesh = new MeshInstance({
                ...camera,
                gpu,
                uvs: [],
                tangents: [],
            })
            this.sphereMesh = new MeshInstance({
                ...sphere,
                gpu
            })
            this.checkerboardTexture = new TextureInstance(ImageProcessor.checkerBoardTexture(), false, this.gpu)
            this.#ready = true

        })
    }

    loop(ref, comp, key) {
        const result = []
        const size = ref.length

        for (let i = 0; i < size; i++) {
            result.push(ref[i].components[comp][key])
        }

        return result
    }

    execute(data, options) {
        super.execute()
        const {
            pointLights,
            directionalLights,
            cubeMaps,
            cameras,
            lightProbes
        } = data
        const {
            camera,
            iconsVisibility,
            iconSize,
            brdf,
            cursor
        } = options

        if (iconsVisibility && this.#ready) {


            Icon.start(this.vertexVBO, this.vao, this.iconShader, this.gpu)
            this.renderers.dLight.draw(
                this.loop(directionalLights, COMPONENTS.DIRECTIONAL_LIGHT, "transformationMatrix"),
                this.directionalLightTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )
            this.renderers.pLight.draw(
                this.loop(pointLights, COMPONENTS.TRANSFORM, "transformationMatrix"),
                this.pointLightTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )
            this.renderers.cubeMap.draw(
                this.loop(cubeMaps, COMPONENTS.TRANSFORM, "transformationMatrix"),
                this.cubemapTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )
            this.renderers.probe.draw(
                this.loop(lightProbes, COMPONENTS.TRANSFORM, "transformationMatrix"),
                this.probeTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )

            // 3D cursor
            this.gpu.disable(this.gpu.DEPTH_TEST)
            const cursorT = cursor.components[COMPONENTS.TRANSFORM]
            this.cursorShader.use()
            this.cursorShader.bindForUse({
                viewMatrix: camera.viewMatrix,
                transformMatrix: cursorT.transformationMatrix,
                projectionMatrix: camera.projectionMatrix,
                sampler: this.checkerboardTexture.texture,
                camPos:  camera.position,
                translation: cursorT.translation
            })
            this.gpu.drawArrays(this.gpu.TRIANGLES, 0, 6)
            this.gpu.enable(this.gpu.DEPTH_TEST)
            // 3D cursor


            Icon.end(this.vertexVBO, this.gpu)

            if (cameras.length > 0) {
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


            // Light probes
            if (lightProbes.length > 0) {
                this.sphereMesh.use()
                this.sphereShader.use()
                const probes = lightProbes.map(l => l.components[COMPONENTS.PROBE].probes).flat()
                for (let i = 0; i < probes.length; i++) {
                    const current = probes[i]

                    this.sphereShader.bindForUse({
                        viewMatrix: camera.viewMatrix,
                        transformMatrix: current.transformedMatrix,
                        projectionMatrix: camera.projectionMatrix,
                        irradiance0: current.cubeMap.irradianceTexture,
                        irradianceMultiplier: [10, 10, 10],
                        brdfSampler: brdf,
                        cameraVec: camera.position
                    })
                    this.gpu.drawElements(this.gpu.TRIANGLES, this.sphereMesh.verticesQuantity, this.gpu.UNSIGNED_INT, 0)
                }
                this.sphereMesh.finish()
            }

            // Light probes
        }

        this.gpu.bindVertexArray(null)
    }

}