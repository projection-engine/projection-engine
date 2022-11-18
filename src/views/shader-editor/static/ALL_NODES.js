import Add from "../libs/nodes/math/Add"
import TextureSample from "../libs/nodes/TextureSample"
import TextureCoords from "../libs/nodes/static/TextureCoords"
import Float from "../libs/nodes/math/Float"
import ElapsedTime from "../libs/nodes/static/ElapsedTime"
import Multiply from "../libs/nodes/math/Multiply"
import Sine from "../libs/nodes/math/Sine"
import Divide from "../libs/nodes/math/Divide"
import Max from "../libs/nodes/math/Max"
import Min from "../libs/nodes/math/Min"
import RGB from "../libs/nodes/RGB"
import AbsoluteWorldPosition from "../libs/nodes/static/AbsoluteWorldPosition"
import CameraCoords from "../libs/nodes/static/CameraCoords"
import NormalVector from "../libs/nodes/static/NormalVector"
import ToTangentSpace from "../libs/nodes/static/ToTangentSpace"
import ViewDirection from "../libs/nodes/static/ViewDirection"
import ParallaxOcclusionMapping from "../libs/nodes/ParallaxOcclusionMapping"
import PerlinNoise from "../libs/nodes/math/PerlinNoise"
import BreakVector from "../libs/nodes/vec/BreakVector"
import DotProduct from "../libs/nodes/vec/DotProduct"
import LinearInterpolate from "../libs/nodes/vec/LinearInterpolate"
import Vec4 from "../libs/nodes/vec/Vec4"
import Vec3 from "../libs/nodes/vec/Vec3"
import Vec2 from "../libs/nodes/vec/Vec2"
import OneMinus from "../libs/nodes/math/OneMinus"
import Saturate from "../libs/nodes/math/Saturate"
import Clamp from "../libs/nodes/math/Clamp"
import Saturation from "../libs/nodes/math/Saturation"
import Pow from "../libs/nodes/math/Pow"
import SceneColor from "../libs/nodes/SceneColor"
import Refract from "../libs/nodes/math/Refract"

import Reflect from "../libs/nodes/math/Reflect"
import Normalize from "../libs/nodes/math/Normalize"
import DDY from "../libs/nodes/math/DDY"
import DDX from "../libs/nodes/math/DDX"
import SineH from "../libs/nodes/math/SineH"
import CosineH from "../libs/nodes/math/CosineH"
import Cosine from "../libs/nodes/math/Cosine"
import MakeVector from "../libs/nodes/vec/MakeVector"

export const ALL_NODES = [
    {
        label: "MakeVector",
        dataTransfer: "MakeVector",
        tooltip: "MakeVector.",
        
        getNewInstance: () => new MakeVector()
    },
    {
        label: "Cosine",
        dataTransfer: "Cosine",
        tooltip: "Cosine.",
        
        getNewInstance: () => new Cosine()
    },
    {
        label: "CosineH",
        dataTransfer: "CosineH",
        tooltip: "Hyperbolic cosine.",
        
        getNewInstance: () => new CosineH()
    },
    {
        label: "SineH",
        dataTransfer: "SineH",
        tooltip: "Hyperbolic sine.",
        
        getNewInstance: () => new SineH()
    },
    {
        label: "DDX",
        dataTransfer: "DDX",
        tooltip: "Partial derivative X.",
        
        getNewInstance: () => new DDX()
    },
    {
        label: "DDY",
        dataTransfer: "DDY",
        tooltip: "Partial derivative Y.",
        
        getNewInstance: () => new DDY()
    },
    {
        label: "Normalize",
        dataTransfer: "Normalize",
        tooltip: "Normalize vector.",
        
        getNewInstance: () => new Normalize()
    },
    {
        label: "Reflect",
        dataTransfer: "Reflect",
        tooltip: "Reflect vector.",
        
        getNewInstance: () => new Reflect()
    },
    {
        label: "Refract",
        dataTransfer: "Refract",
        tooltip: "Refract vector.",
        
        getNewInstance: () => new Refract()
    },



    {
        label: "SceneColor",
        dataTransfer: "SceneColor",
        tooltip: "Scene color.",
        
        getNewInstance: () => new SceneColor()
    },
    {
        label: "Pow",
        dataTransfer: "Pow",
        tooltip: "Power to exponent.",
        
        getNewInstance: () => new Pow()
    },
    {
        label: "Saturation",
        dataTransfer: "Saturation",
        tooltip: "Adjust saturation.",
        
        getNewInstance: () => new Saturation()
    },
    {
        label: "Saturate",
        dataTransfer: "Saturate",
        tooltip: "Clamp between 0 and 1.",
        
        getNewInstance: () => new Saturate()
    },
    {
        label: "Clamp",
        dataTransfer: "Clamp",
        tooltip: "One minus X.",
        
        getNewInstance: () => new Clamp()
    },
    {
        label: "1-X (OneMinusX)",
        dataTransfer: "OneMinus",
        tooltip: "One minus X.",
        
        getNewInstance: () => new OneMinus()
    },
    {
        label: "Vec2",
        dataTransfer: "Vec2",
        tooltip: "2D vector.",
        
        getNewInstance: () => new Vec2()
    },
    {
        label: "Vec3",
        dataTransfer: "Vec3",
        tooltip: "3D vector.",
        
        getNewInstance: () => new Vec3()
    },
    {
        label: "Vec4",
        dataTransfer: "Vec4",
        tooltip: "4D vector.",
        
        getNewInstance: () => new Vec4()
    },
    {
        label: "BreakVector",
        dataTransfer: "BreakVector",
        tooltip: "Break vector.",
        
        getNewInstance: () => new BreakVector()
    },

    {
        label: "DotProduct",
        dataTransfer: "DotProduct",
        tooltip: "Dot product vec4",
        
        getNewInstance: () => new DotProduct()
    },


    {
        label: "LinearInterpolate",
        dataTransfer: "LinearInterpolate",
        tooltip: "Linear interpolate vec3.",
        
        getNewInstance: () => new LinearInterpolate()
    },


    {
        label: "PerlinNoise",
        dataTransfer: "PerlinNoise",
        tooltip: "Perlin Noise.",
        
        getNewInstance: () => new PerlinNoise()
    },
    {
        label: "TextureCoords",
        dataTransfer: "TextureCoords",
        tooltip: "Fragment texture coordinates.",
        
        getNewInstance: () => new TextureCoords()
    },
    {
        label: "CameraCoords",
        dataTransfer: "CameraCoords",
        tooltip: "Camera coordinates.",
        
        getNewInstance: () => new CameraCoords()
    },
    {
        label: "AbsoluteWorldPosition",
        dataTransfer: "AbsoluteWorldPosition",
        tooltip: "Vertex coordinates.",
        
        getNewInstance: () => new AbsoluteWorldPosition()
    },
    {
        label: "NormalVector",
        dataTransfer: "NormalVector",
        tooltip: "Surface normal.",
        
        getNewInstance: () => new NormalVector()
    },
    {
        label: "ToTangentSpace",
        dataTransfer: "ToTangentSpace",
        tooltip: "To tangent space matrix.",
        
        getNewInstance: () => new ToTangentSpace()
    },
    {
        label: "ViewDirection",
        dataTransfer: "ViewDirection",
        tooltip: "View direction vector.",
        
        getNewInstance: () => new ViewDirection()
    },
    {
        label: "ParallaxOcclusionMapping",
        dataTransfer: "ParallaxOcclusionMapping",
        tooltip: "Parallax occlusion mapping.",
        
        getNewInstance: () => new ParallaxOcclusionMapping()
    },


    {
        label: "Add",
        dataTransfer: "Add",
        tooltip: "Adds two values (float, int, vec2, vec3, vec4)",
        
        getNewInstance: () => new Add()
    },
    {
        label: "TextureSample",
        dataTransfer: "TextureSample",
        tooltip: "Gets texture value (sampler 2d)",
        
        getNewInstance: () => new TextureSample()
    },

    {
        label: "Float",
        dataTransfer: "Float",
        tooltip: "Float uniform.",
        
        getNewInstance: () => new Float()
    },  {
        label: "Elapsed",
        dataTransfer: "ElapsedTime",
        tooltip: "Elapsed time.",
        
        getNewInstance: () => new ElapsedTime()
    }, {
        label: "Multiply",
        dataTransfer: "Multiply",
        tooltip: "Multiplies two values.",
        
        getNewInstance: () => new Multiply()
    },
    {
        label: "Sine",
        dataTransfer: "Sine",
        tooltip: "Sine of a value.",
        
        getNewInstance: () => new Sine()
    },    {
        label: "Divide",
        dataTransfer: "Divide",
        tooltip: "Divides two values.",
        
        getNewInstance: () => new Divide()
    },{
        label: "Min",
        dataTransfer: "Min",
        tooltip: "Min between two values.",
        
        getNewInstance: () => new Min()
    },{
        label: "Max",
        dataTransfer: "Max",
        tooltip: "Max between two values.",
        
        getNewInstance: () => new Max()
    },{
        label: "RGB",
        dataTransfer: "RGB",
        tooltip: "RGB color.",
        
        getNewInstance: () => new RGB()
    },
]