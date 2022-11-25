import Material from "../libs/nodes/Material"
import SceneColor from "../libs/nodes/SceneColor"
import Add from "../libs/nodes/math/Add"
import TextureSample from "../libs/nodes/TextureSample"
import TextureCoords from "../libs/nodes/static/TextureCoords"
import Float from "../libs/nodes/math/Float"
import Divide from "../libs/nodes/math/Divide"
import Sine from "../libs/nodes/math/Sine"
import NormalVector from "../libs/nodes/static/NormalVector"
import ParallaxOcclusionMapping from "../libs/nodes/ParallaxOcclusionMapping"
import RGB from "../libs/nodes/RGB"
import ToTangentSpace from "../libs/nodes/static/ToTangentSpace"
import AbsoluteWorldPosition from "../libs/nodes/static/AbsoluteWorldPosition"
import ViewDirection from "../libs/nodes/static/ViewDirection"
import CameraCoords from "../libs/nodes/static/CameraCoords"
import ElapsedTime from "../libs/nodes/static/ElapsedTime"
import Multiply from "../libs/nodes/math/Multiply"
import PerlinNoise from "../libs/nodes/math/PerlinNoise"
import BreakVector from "../libs/nodes/vec/BreakVector"
import DotProduct from "../libs/nodes/vec/DotProduct"
import LinearInterpolate from "../libs/nodes/vec/LinearInterpolate"
import Max from "../libs/nodes/math/Max"
import Min from "../libs/nodes/math/Min"
import Vec2 from "../libs/nodes/vec/Vec2"
import Vec3 from "../libs/nodes/vec/Vec3"
import Vec4 from "../libs/nodes/vec/Vec4"
import OneMinus from "../libs/nodes/math/OneMinus"
import Saturate from "../libs/nodes/math/Saturate"
import Clamp from "../libs/nodes/math/Clamp"
import Saturation from "../libs/nodes/math/Saturation"
import Pow from "../libs/nodes/math/Pow"
import MakeVector from "../libs/nodes/vec/MakeVector"
import Cosine from "../libs/nodes/math/Cosine"
import SineH from "../libs/nodes/math/SineH"
import CosineH from "../libs/nodes/math/CosineH"
import DDX from "../libs/nodes/math/DDX"
import DDY from "../libs/nodes/math/DDY"
import Normalize from "../libs/nodes/math/Normalize"
import Reflect from "../libs/nodes/math/Reflect"
import Refract from "../libs/nodes/math/Refract"
import Tan from "../libs/nodes/math/Tan"
import Comment from "../libs/nodes/Comment"

export default function getNewInstance(name) {

    switch (name) {
    case Cosine.name:
        return new Cosine()
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
    case SceneColor:
        return new SceneColor()
    case Add:
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
        return new Comment()
    default:
        return null
    }
}