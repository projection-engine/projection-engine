import Shader from "@engine-core/lib/resources/Shader"
import Framebuffer from "@engine-core/lib/resources/Framebuffer"
import Material from "@engine-core/lib/resources/Material"
import Mesh from "@engine-core/lib/resources/Mesh"
import Texture from "@engine-core/lib/resources/Texture"
import LightProbe from "@engine-core/lib/resources/LightProbe"
import DynamicMap from "../lib/DynamicMap"
import AbstractMesh from "@engine-core/lib/resources/AbstractMesh";
import Terrain from "@engine-core/lib/resources/Terrain";

export default class GPUState {
    static context?: WebGL2RenderingContext
    static canvas?: HTMLCanvasElement
    static activeShader?: Shader
    static activeFramebuffer?: Framebuffer
    static activeMesh?: AbstractMesh
    static materials = new DynamicMap<string, Material>()
    static shaders = new DynamicMap<string, Shader>()
    static frameBuffers = new DynamicMap<string, Framebuffer>()
    static meshes = new DynamicMap<string, Mesh>()
    static terrains = new DynamicMap<string, Terrain>()
    static textures = new DynamicMap<string, Texture>()
    static BRDF: WebGLTexture
    static internalResolution = {w: 0, h: 0}
    static skylightProbe: LightProbe
    static bufferResolution = new Float32Array([0, 0])
}
