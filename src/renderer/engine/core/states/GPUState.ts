import ImageProcessor from "../lib/math/ImageProcessor"
import TerrainGenerator from "../lib/math/TerrainGenerator"
import CameraManager from "../managers/CameraManager"
import TransformationManager from "../managers/TransformationManager"
import CubeMapManager from "../managers/CubeMapManager"
import QUAD_VERT from "../static/shaders/post-processing/QUAD.vert"
import BRDF_FRAG from "../static/shaders/post-processing/BRDF_GEN.frag"
import Shader from "@engine-core/lib/resources/Shader"
import Framebuffer from "@engine-core/lib/resources/Framebuffer"
import Material from "@engine-core/lib/resources/Material"
import Mesh from "@engine-core/lib/resources/Mesh"
import Texture from "@engine-core/lib/resources/Texture"
import LightProbe from "@engine-core/lib/resources/LightProbe"
import DynamicMap from "../lib/DynamicMap"

export default class GPUState {
    static context?: WebGL2RenderingContext
    static canvas?: HTMLCanvasElement
    static activeShader?: Shader
    static activeFramebuffer?: Framebuffer
    static activeMesh?: Mesh
    static materials = new DynamicMap<string, Material>()
    static shaders = new DynamicMap<string, Shader>()
    static frameBuffers = new DynamicMap<string, Framebuffer>()
    static meshes = new DynamicMap<string, Mesh>()
    static textures = new DynamicMap<string, Texture>()
    static BRDF: WebGLTexture
    static internalResolution = {w: 0, h: 0}
    static skylightProbe: LightProbe
    static bufferResolution = new Float32Array([0, 0])
}
