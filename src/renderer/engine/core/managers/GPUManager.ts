import Texture from "@engine-core/lib/resources/Texture"
import Material from "@engine-core/lib/resources/Material"
import QUAD_VERT from "../static/shaders/post-processing/QUAD.vert"
import BRDF_FRAG from "../static/shaders/post-processing/BRDF_GEN.frag"
import Framebuffer from "@engine-core/lib/resources/Framebuffer"
import Mesh from "@engine-core/lib/resources/Mesh"
import Shader from "@engine-core/lib/resources/Shader"
import GPUState from "../states/GPUState"
import MaterialManager from "./MaterialManager"
import UberShader from "../lib/UberShader"
import StaticMeshesState from "../states/StaticMeshesState"
import EngineState from "../states/EngineState";
import StaticUBOState from "@engine-core/states/StaticUBOState";
import CameraManager from "@engine-core/managers/CameraManager";
import TransformationManager from "@engine-core/managers/TransformationManager";
import TerrainProcessor from "@engine-core/lib/math/TerrainProcessor";
import ImageProcessor from "@engine-core/lib/math/ImageProcessor";
import CubeMapManager from "@engine-core/managers/CubeMapManager";
import StaticFBOState from "@engine-core/states/StaticFBOState";
import StaticShadersState from "@engine-core/states/StaticShadersState";
import Terrain from "@engine-core/lib/resources/Terrain";

export default class GPUManager {
    static async allocateTexture(imageData: string | TextureParams, id: string) {
        try {
            if (GPUState.textures.get(id) != null)
                return GPUState.textures.get(id)
            const texture = new Texture(id)
            await texture.initialize(typeof imageData === "string" ? {img: imageData} : imageData)

            GPUState.textures.set(id, texture)
            return texture
        } catch (err) {
            console.error(err)
            return null
        }
    }

    static destroyTexture(textureId: string) {
        const found = GPUState.textures.get(textureId)
        if (!found)
            return
        if (found.texture instanceof WebGLTexture)
            GPUState.context.deleteTexture(found.texture)
        GPUState.textures.delete(textureId)
    }

    static destroyMaterial(id: string) {
        const mat = GPUState.materials.get(id)
        if (!mat)
            return
        delete UberShader.uberSignature[mat.signature]
        GPUState.materials.delete(id)
    }

    static async allocateMaterial(materialInformation: MaterialInformation, id: string): Promise<Material | undefined> {
        if (GPUState.materials.get(id) !== undefined)
            return GPUState.materials.get(id)
        const signature = materialInformation.executionSignature
        const material = new Material(id, signature)

        material.updateMaterialDeclaration(materialInformation.functionDeclaration, materialInformation.uniformsDeclaration)
        await material.updateUniformGroup(materialInformation.uniformValues)
        MaterialManager.registerMaterial(material)
        const settings = materialInformation.settings

        UberShader.uberSignature[signature] = true

        material.renderingMode = settings.renderingMode
        material.doubleSided = settings.doubleSided
        material.ssrEnabled = settings.ssrEnabled

        GPUState.materials.set(id, material)

        UberShader.compile()
        EngineState.visibilityNeedsUpdate = true
        return material
    }


    static createBuffer(type, data, renderingType: number = GPUState.context.STATIC_DRAW) {
        if (!data && data.buffer instanceof ArrayBuffer && data.byteLength !== undefined || data.length === 0)
            return null
        const buffer = GPUState.context.createBuffer()
        GPUState.context.bindBuffer(type, buffer)
        GPUState.context.bufferData(type, data, renderingType)
        return buffer
    }


    static cleanUpTextures() {
        const mat = Array.from(GPUState.materials.values())
        const textures = Array.from(GPUState.textures.keys())
        const inUse = {}
        for (let i = 0; i < mat.length; i++) {
            textures.forEach(t => {
                if (!mat[i]?.texturesInUse)
                    return
                if (mat[i].texturesInUse[t] != null)
                    inUse[t] = true
            })
        }
        textures.forEach(t => {
            if (!inUse[t])
                GPUManager.destroyTexture(t)
        })
    }

    static copyTexture(target: Framebuffer, source: Framebuffer, type: number = GPUState.context.DEPTH_BUFFER_BIT, blitType = GPUState.context.NEAREST) {
        const context = GPUState.context
        context.bindFramebuffer(context.READ_FRAMEBUFFER, source.FBO)
        context.bindFramebuffer(context.DRAW_FRAMEBUFFER, target.FBO)
        context.blitFramebuffer(
            0, 0,
            source.width, source.height,
            0, 0,
            target.width, target.height,
            type,
            blitType
        )
        context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null)
    }

    static allocateFramebuffer(id, width = GPUState.internalResolution.w, height = GPUState.internalResolution.h) {
        if (GPUState.frameBuffers.get(id))
            return GPUState.frameBuffers.get(id)
        const fbo = new Framebuffer(width, height)
        GPUState.frameBuffers.set(id, fbo)
        return fbo
    }

    static destroyFramebuffer(id) {
        const fbo = GPUState.frameBuffers.get(id)
        if (!fbo)
            return
        for (let i = 0; i < fbo.colors.length; i++) {
            GPUState.context.deleteTexture(fbo.colors[i])
        }
        if (fbo.depthSampler instanceof WebGLTexture)
            GPUState.context.deleteTexture(fbo.depthSampler)
        if (fbo.RBO)
            GPUState.context.deleteRenderbuffer(fbo.RBO)
        GPUState.context.deleteFramebuffer(fbo.FBO)
        GPUState.frameBuffers.delete(id)
    }

    static allocateMesh(id: string, bufferData: MeshProps) {
        if (GPUState.meshes.has(id))
            return GPUState.meshes.get(id)
        const instance = new Mesh({...bufferData, id})
        GPUState.meshes.set(id, instance)
        EngineState.visibilityNeedsUpdate = true
        return instance
    }

    static destroyMesh(instance: string | Mesh) {
        const mesh = typeof instance === "string" ? GPUState.meshes.get(instance) : instance
        if ([StaticMeshesState.cube, StaticMeshesState.plane, StaticMeshesState.cylinder, StaticMeshesState.sphere].includes(mesh))
            return

        if (mesh instanceof Mesh) {
            GPUState.context.deleteVertexArray(mesh.VAO)
            GPUState.context.deleteBuffer(mesh.indexVBO)
            if (mesh.uvVBO)
                mesh.uvVBO.delete()
            if (mesh.normalVBO)
                mesh.normalVBO.delete()
            GPUState.meshes.delete(mesh.id)
        }
        EngineState.visibilityNeedsUpdate = true
    }

    static allocateShader(id, vertex, fragment) {
        const instance = new Shader(vertex, fragment)
        GPUState.shaders.set(id, instance)
        return instance
    }

    static destroyShader(id: string) {
        const instance = GPUState.shaders.get(id)
        if (!instance)
            return
        GPUState.context.deleteProgram(instance.program)
        GPUState.shaders.delete(id)
    }

    static async initializeContext(canvas: HTMLCanvasElement, mainResolution: { w: number, h: number } | undefined) {
        if (GPUState.context != null)
            return

        const screen = window.screen
        GPUState.internalResolution.w = mainResolution?.w || screen.width
        GPUState.internalResolution.h = mainResolution?.h || screen.height
        GPUState.bufferResolution[0] = GPUState.internalResolution.w
        GPUState.bufferResolution[1] = GPUState.internalResolution.h
        this.#initializeContext(canvas);
        this.#enableDefault();
        await this.#initializeResources();
        this.#generateBRDF();
    }

    static #initializeContext(canvas: HTMLCanvasElement) {
        GPUState.context = canvas.getContext("webgl2", {
            antialias: false,
            // preserveDrawingBuffer: false,
            premultipliedAlpha: false,
            powerPreference: "high-performance"
        })
        GPUState.canvas = canvas
        GPUState.context.getExtension("EXT_color_buffer_float")
        GPUState.context.getExtension("OES_texture_float")
        GPUState.context.getExtension("OES_texture_float_linear")
    }

    static #generateBRDF() {
        const FBO = new Framebuffer(512, 512).texture({precision: GPUState.context.RG32F, format: GPUState.context.RG})
        const brdfShader = new Shader(QUAD_VERT, BRDF_FRAG)

        FBO.startMapping()
        brdfShader.bind()
        StaticMeshesState.drawQuad()
        FBO.stopMapping()
        GPUState.BRDF = FBO.colors[0]
        GPUState.context.deleteProgram(brdfShader.program)
    }

    static async #initializeResources() {
        StaticUBOState.initialize()
        CameraManager.initialize()
        await StaticMeshesState.initialize()
        StaticShadersState.initialize()
        StaticFBOState.initialize()
        TransformationManager.initialize()
        TerrainProcessor.initialize()
        ImageProcessor.initialize()
        CubeMapManager.initialize()
    }

    static #enableDefault() {
        GPUState.context.enable(GPUState.context.BLEND)
        GPUState.context.blendFunc(GPUState.context.SRC_ALPHA, GPUState.context.ONE_MINUS_SRC_ALPHA)
        GPUState.context.enable(GPUState.context.CULL_FACE)
        GPUState.context.cullFace(GPUState.context.BACK)
        GPUState.context.enable(GPUState.context.DEPTH_TEST)
        GPUState.context.depthFunc(GPUState.context.LESS)
        GPUState.context.frontFace(GPUState.context.CCW)
    }

    static allocateTerrain(id: string, bufferData: TerrainProcessorResult) {
        if (GPUState.terrains.has(id))
            return GPUState.terrains.get(id)
        const instance = new Terrain({...bufferData, id})
        GPUState.terrains.set(id, instance)
        return instance
    }


    static destroyTerrain(instance: string | Terrain) {
        const terrain = typeof instance === "string" ? GPUState.terrains.get(instance) : instance

        GPUState.context.deleteVertexArray(terrain.VAO)
        GPUState.context.deleteBuffer(terrain.indexVBO)
        if (terrain.uvVBO)
            terrain.uvVBO.delete()
        if (terrain.normalVBO)
            terrain.normalVBO.delete()
        GPUState.terrains.delete(terrain.id)
        EngineState.visibilityNeedsUpdate = true
    }

}
