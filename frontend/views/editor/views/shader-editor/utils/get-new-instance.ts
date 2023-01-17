import Material from "../templates/nodes/Material"
import SceneColor from "../templates/nodes/static/SceneColor"
import Add from "../templates/nodes/math/Add"
import TextureSample from "../templates/nodes/TextureSample"
import TextureCoords from "../templates/nodes/static/TextureCoords"
import Float from "../templates/nodes/math/Float"
import Divide from "../templates/nodes/math/Divide"
import Sine from "../templates/nodes/math/Sine"
import NormalVector from "../templates/nodes/static/NormalVector"
import ParallaxOcclusionMapping from "../templates/nodes/ParallaxOcclusionMapping"
import RGB from "../templates/nodes/RGB"
import ToTangentSpace from "../templates/nodes/static/ToTangentSpace"
import AbsoluteWorldPosition from "../templates/nodes/static/AbsoluteWorldPosition"
import ViewDirection from "../templates/nodes/static/ViewDirection"
import CameraCoords from "../templates/nodes/static/CameraCoords"
import ElapsedTime from "../templates/nodes/static/ElapsedTime"
import Multiply from "../templates/nodes/math/Multiply"
import PerlinNoise from "../templates/nodes/math/PerlinNoise"
import BreakVector from "../templates/nodes/vec/BreakVector"
import DotProduct from "../templates/nodes/vec/DotProduct"
import LinearInterpolate from "../templates/nodes/vec/LinearInterpolate"
import Max from "../templates/nodes/math/Max"
import Min from "../templates/nodes/math/Min"
import Vec2 from "../templates/nodes/vec/Vec2"
import Vec3 from "../templates/nodes/vec/Vec3"
import Vec4 from "../templates/nodes/vec/Vec4"
import OneMinus from "../templates/nodes/math/OneMinus"
import Saturate from "../templates/nodes/math/Saturate"
import Clamp from "../templates/nodes/math/Clamp"
import Saturation from "../templates/nodes/math/Saturation"
import Pow from "../templates/nodes/math/Pow"
import MakeVector from "../templates/nodes/vec/MakeVector"
import Cosine from "../templates/nodes/math/Cosine"
import SineH from "../templates/nodes/math/SineH"
import CosineH from "../templates/nodes/math/CosineH"
import DDX from "../templates/nodes/math/DDX"
import DDY from "../templates/nodes/math/DDY"
import Normalize from "../templates/nodes/math/Normalize"
import Reflect from "../templates/nodes/math/Reflect"
import Refract from "../templates/nodes/math/Refract"
import Tan from "../templates/nodes/math/Tan"
import Comment from "../templates/Comment"
import ShaderNode from "../templates/ShaderNode";
import FragCoord from "../templates/nodes/static/FragCoord";
import QuadUV from "../templates/nodes/static/QuadUV";
import SampleColor from "../templates/nodes/SampleColor";
import Fresnel from "../templates/Fresnel";
import GaussianBlur from "../templates/GaussianBlur";

export default function getNewInstance(name: string): ShaderNode | Comment | null {

    switch (name) {
        case Cosine.name:
            return new Cosine()
        case Fresnel.name:
            return new Fresnel()
        case GaussianBlur.name:
            return new GaussianBlur()
        case FragCoord.name:
            return new FragCoord()
        case SampleColor.name:
            return new SampleColor()
        case QuadUV.name:
            return new QuadUV()
        case Sine.name:
            return new Sine()
        case SineH.name:
            return new SineH()
        case CosineH.name:
            return new CosineH()
        case Tan.name:
            return new Tan()
        case DDX.name:
            return new DDX()
        case DDY.name:
            return new DDY()
        case Reflect.name:
            return new Reflect()
        case Refract.name:
            return new Refract()
        case Normalize.name:
            return new Normalize()
        case Material.name:
            return new Material()
        case SceneColor.name:
            return new SceneColor()
        case Add.name:
            return new Add()
        case TextureSample.name:
            return new TextureSample()
        case TextureCoords.name:
            return new TextureCoords()
        case Float.name:
            return new Float()
        case Divide.name:
            return new Divide()
        case NormalVector.name:
            return new NormalVector()
        case ParallaxOcclusionMapping.name:
            return new ParallaxOcclusionMapping()
        case RGB.name:
            return new RGB()
        case ToTangentSpace.name:
            return new ToTangentSpace()
        case AbsoluteWorldPosition.name:
            return new AbsoluteWorldPosition()
        case ViewDirection.name:
            return new ViewDirection()
        case CameraCoords.name:
            return new CameraCoords()
        case ElapsedTime.name:
            return new ElapsedTime()
        case Multiply.name:
            return new Multiply()
        case PerlinNoise.name:
            return new PerlinNoise()
        case BreakVector.name:
            return new BreakVector()
        case DotProduct.name:
            return new DotProduct()
        case LinearInterpolate.name:
            return new LinearInterpolate()
        case Max.name:
            return new Max()
        case Min.name:
            return new Min()
        case Vec2.name:
            return new Vec2()
        case Vec3.name:
            return new Vec3()
        case Vec4.name:
            return new Vec4()
        case OneMinus.name:
            return new OneMinus()
        case Saturate.name:
            return new Saturate()
        case Clamp.name:
            return new Clamp()
        case Saturation.name:
            return new Saturation()
        case Pow.name:
            return new Pow()
        case MakeVector.name:
            return new MakeVector()
        case Comment.name:
            return new Comment(10, 10)
        default:
            return null
    }
}