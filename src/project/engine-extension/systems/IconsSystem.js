import System from "../../engine/basic/System"
import TextureInstance from "../../engine/instances/TextureInstance"
import Icon from "../instances/Icon"
import * as cameraShaderCode from "../shaders/GIZMO.glsl"
import * as iconShaderCode from "../shaders/ICON.glsl"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import MeshInstance from "../../engine/instances/MeshInstance"
import {fragmentForward, vertex} from "../../engine/shaders/mesh/FALLBACK.glsl"
import {createVAO} from "../../engine/utils/utils"
import VBOInstance from "../../engine/instances/VBOInstance"
import ImageProcessor from "../../engine/utils/image/ImageProcessor"

const PLANE =  new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0])
export default class IconsSystem extends System {
    #ready = false

    constructor() {
        super()
        const gpu = window.gpu
        this.renderers = {
            pLight: new Icon(),
            dLight: new Icon(),
            cubeMap: new Icon(),
            probe: new Icon()
        }

        this.iconShader = new ShaderInstance(iconShaderCode.vertex, iconShaderCode.fragment)
        this.cameraShader = new ShaderInstance(cameraShaderCode.shadedVertex, cameraShaderCode.shadedFragment)
        this.sphereShader = new ShaderInstance(vertex, fragmentForward)
        this.cursorShader = new ShaderInstance(iconShaderCode.cursorVertex, iconShaderCode.cursorFragment)

        this.vao = createVAO()
        this.vertexVBO = new VBOInstance( 0, PLANE, gpu.ARRAY_BUFFER, 3, gpu.FLOAT, false)

        Promise.all([
            import("../../../static/icons/point_light.png"),
            import("../../../static/icons/directional_light.png"),
            import("../../../static/icons/cubemap.png"),
            import("../../../static/icons/probe.png"),
            import("../../../static/meshes/Camera.json"),
            import("../../../static/meshes/Sphere.json"),
        ]).then(res => {
            const [pl, dl, cm, p, camera, sphere] = res
            this.pointLightTexture = new TextureInstance(pl.default, false)
            this.directionalLightTexture = new TextureInstance(dl.default, false)
            this.cubemapTexture = new TextureInstance(cm.default, false)
            this.probeTexture = new TextureInstance(p.default, false)
            this.cameraMesh = new MeshInstance({
                ...camera,
                uvs: [],
                tangents: [],
            })
            this.sphereMesh = new MeshInstance(sphere)
            this.checkerboardTexture = new TextureInstance(ImageProcessor.checkerBoardTexture(), false )
            this.#ready = true

        })
    }

    loop(ref, comp, key, selectedMap) {
        const result = []
        const size = ref.length

        for (let i = 0; i < size; i++) {
            if(!selectedMap[ref[i].id])
                result.push(ref[i].components[comp][key])
        }

        return result
    }

    drawHighlighted(transformComponent, camera, texture, forceAsIcon, iconSize){
        window.gpu.disable(window.gpu.DEPTH_TEST)

        this.cursorShader.use()
        this.cursorShader.bindForUse({
            viewMatrix: camera.viewMatrix,
            transformMatrix: transformComponent.transformationMatrix,
            projectionMatrix: camera.projectionMatrix,
            sampler: texture,
            camPos:  camera.position,
            translation: transformComponent.translation ? transformComponent.translation : transformComponent.direction,
            forceAsIcon,
            iconSize,
            cameraIsOrthographic: camera.ortho,
        })
        window.gpu.drawArrays(window.gpu.TRIANGLES, 0, 6)
        window.gpu.enable(window.gpu.DEPTH_TEST)
    }

    getIcon(entity){
        const c = entity.components
        const isDLight = c[COMPONENTS.DIRECTIONAL_LIGHT] !== undefined
        const isPLight = c[COMPONENTS.POINT_LIGHT] !== undefined
        const isCM = c[COMPONENTS.CUBE_MAP] !== undefined
        const isProbe = c[COMPONENTS.PROBE] !== undefined

        const isEntity  =isDLight || isPLight || isCM || isProbe
        if(isEntity)
            switch (true){
            case isDLight:
                return this.directionalLightTexture.texture
            case isPLight:
                return this.pointLightTexture.texture
            case isCM:
                return this.cubemapTexture.texture
            case isProbe:
                return this.probeTexture.texture
            }

        return undefined
    }
    execute(data, options, entitiesMap) {
        super.execute()
        const {
            pointLights,
            directionalLights,
            cubeMaps,
            cameras,
            lightProbes
        } = data
        const {
            selectedMap,
            camera,
            iconsVisibility,
            iconSize,
            brdf,
            cursor,
            selected
        } = options

        if (iconsVisibility && this.#ready) {


            Icon.start(this.vertexVBO, this.vao, this.iconShader)
            this.renderers.dLight.draw(
                this.loop(directionalLights, COMPONENTS.DIRECTIONAL_LIGHT, "transformationMatrix", selectedMap),
                this.directionalLightTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )
            this.renderers.pLight.draw(
                this.loop(pointLights, COMPONENTS.TRANSFORM, "transformationMatrix", selectedMap),
                this.pointLightTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )
            this.renderers.cubeMap.draw(
                this.loop(cubeMaps, COMPONENTS.TRANSFORM, "transformationMatrix", selectedMap),
                this.cubemapTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )
            this.renderers.probe.draw(
                this.loop(lightProbes, COMPONENTS.TRANSFORM, "transformationMatrix", selectedMap),
                this.probeTexture.texture,
                camera,
                iconSize,
                this.iconShader
            )

            // 3D cursor
            this.drawHighlighted(cursor.components[COMPONENTS.TRANSFORM], camera, this.checkerboardTexture.texture)
            // 3D cursor

            for(let i = 0; i<selected.length; i++){
                const entity = entitiesMap[selected[i]]
                const icon = entity.active ? this.getIcon(entity) : undefined
                if(icon) {
                    let t = entity.components[COMPONENTS.TRANSFORM]
                    if(!t)
                        t = entity.components[COMPONENTS.DIRECTIONAL_LIGHT]
                    this.drawHighlighted(t, camera, icon, true, iconSize)
                }
            }
            Icon.end(this.vertexVBO)

            if (cameras.length > 0) {
                this.cameraShader.use()
                window.gpu.bindVertexArray(this.cameraMesh.VAO)
                window.gpu.bindBuffer(window.gpu.ELEMENT_ARRAY_BUFFER, this.cameraMesh.indexVBO)
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
                    window.gpu.drawElements(window.gpu.TRIANGLES, this.cameraMesh.verticesQuantity, window.gpu.UNSIGNED_INT, 0)
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
                    window.gpu.drawElements(window.gpu.TRIANGLES, this.sphereMesh.verticesQuantity, window.gpu.UNSIGNED_INT, 0)
                }
                this.sphereMesh.finish()
            }

            // Light probes
        }

        window.gpu.bindVertexArray(null)
    }

}