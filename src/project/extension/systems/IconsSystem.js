import System from "../../engine/basic/System";
import TextureInstance from "../../engine/instances/TextureInstance";
import Icon from "../Icon";
import * as shaderCode from '../shaders/gizmo.glsl'
import ShaderInstance from "../../engine/instances/ShaderInstance";
import COMPONENTS from "../../engine/templates/COMPONENTS";
import MeshInstance from "../../engine/instances/MeshInstance";
import {mat4} from "gl-matrix";
import {fragmentForward, vertex} from '../../engine/shaders/mesh/FALLBACK.glsl'
const identity = mat4.create()
export default class IconsSystem extends System {
    #ready = false

    constructor(gpu) {
        super([]);
        this.gpu = gpu
        this.billboardRenderer = new Icon(gpu)
        this.cameraShader = new ShaderInstance(shaderCode.shadedVertex, shaderCode.shadedFragment, gpu)


        Promise.all([
            import("../icons/point_light.png"),
            import("../icons/directional_light.png"),
            import("../icons/spot_light.png"),
            import("../icons/cubemap.png"),
            import("../icons/probe.png"),
            import("../../../static/assets/Camera.json"),
            import("../../../static/assets/Sphere.json"),
        ]).then(res => {
            const [pl, dl, sl, cm, p, camera, sphere] = res
            this.pointLightTexture = new TextureInstance(pl.default, false, this.gpu)
            this.directionalLightTexture = new TextureInstance(dl.default, false, this.gpu)
            this.spotLightTexture = new TextureInstance(sl.default, false, this.gpu)
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
            this.#ready = true

        })

        this.sphereShader = new ShaderInstance(vertex, fragmentForward, gpu)
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
            skylight,
            cameras,
            lightProbes
        } = data
        const {

            camera,
            iconsVisibility,
            iconSize,
            fallbackMaterial,
            brdf
        } = options


        if (iconsVisibility && this.#ready) {
            this.billboardRenderer.start()
            this.billboardRenderer.draw(
                this.loop(pointLights, COMPONENTS.TRANSFORM, 'transformationMatrix'),
                this.pointLightTexture.texture,
                camera,
                iconSize)
            this.billboardRenderer.draw(
                this.loop(directionalLights, COMPONENTS.DIRECTIONAL_LIGHT, 'transformationMatrix'),
                this.directionalLightTexture.texture,
                camera,
                iconSize
            )
            if (skylight)
                this.billboardRenderer.draw(
                    [skylight.transformationMatrix],
                    this.directionalLightTexture.texture,
                    camera,
                    iconSize
                )
            this.billboardRenderer.draw(
                this.loop(cubeMaps, COMPONENTS.TRANSFORM, 'transformationMatrix'),
                this.cubemapTexture.texture,
                camera,
                iconSize
            )
            this.billboardRenderer.draw(
                this.loop(lightProbes, COMPONENTS.TRANSFORM, 'transformationMatrix'),
                this.probeTexture.texture,
                camera,
                iconSize)
            this.billboardRenderer.end()

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

            if (lightProbes.length > 0) {
                this.sphereShader.use()
                this.sphereMesh.use()
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
        }

        this.gpu.bindVertexArray(null)
    }

}