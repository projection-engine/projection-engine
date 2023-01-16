import MakeVector from "../templates/nodes/vec/MakeVector";
import Cosine from "../templates/nodes/math/Cosine";
import CosineH from "../templates/nodes/math/CosineH";
import SineH from "../templates/nodes/math/SineH";
import DDX from "../templates/nodes/math/DDX";
import DDY from "../templates/nodes/math/DDY";
import Normalize from "../templates/nodes/math/Normalize";
import Reflect from "../templates/nodes/math/Reflect";
import Refract from "../templates/nodes/math/Refract";
import SceneColor from "../templates/nodes/static/SceneColor";
import Pow from "../templates/nodes/math/Pow";
import Saturation from "../templates/nodes/math/Saturation";
import Saturate from "../templates/nodes/math/Saturate";
import Clamp from "../templates/nodes/math/Clamp";
import OneMinus from "../templates/nodes/math/OneMinus";
import Vec2 from "../templates/nodes/vec/Vec2";
import Vec3 from "../templates/nodes/vec/Vec3";
import Vec4 from "../templates/nodes/vec/Vec4";
import BreakVector from "../templates/nodes/vec/BreakVector";
import DotProduct from "../templates/nodes/vec/DotProduct";
import LinearInterpolate from "../templates/nodes/vec/LinearInterpolate";
import PerlinNoise from "../templates/nodes/math/PerlinNoise";
import TextureCoords from "../templates/nodes/static/TextureCoords";
import CameraCoords from "../templates/nodes/static/CameraCoords";
import AbsoluteWorldPosition from "../templates/nodes/static/AbsoluteWorldPosition";
import NormalVector from "../templates/nodes/static/NormalVector";
import ToTangentSpace from "../templates/nodes/static/ToTangentSpace";
import ViewDirection from "../templates/nodes/static/ViewDirection";
import ParallaxOcclusionMapping from "../templates/nodes/ParallaxOcclusionMapping";
import Add from "../templates/nodes/math/Add";
import TextureSample from "../templates/nodes/TextureSample";
import Float from "../templates/nodes/math/Float";
import ElapsedTime from "../templates/nodes/static/ElapsedTime";
import Multiply from "../templates/nodes/math/Multiply";
import Sine from "../templates/nodes/math/Sine";
import Divide from "../templates/nodes/math/Divide";
import Min from "../templates/nodes/math/Min";
import Max from "../templates/nodes/math/Max";
import RGB from "../templates/nodes/RGB";
import FragCoord from "../templates/nodes/static/FragCoord";
import QuadUV from "../templates/nodes/static/QuadUV";
import SampleColor from "../templates/nodes/SampleColor";

export default function getNodeInstance(key: string) {
    switch (key) {
        case "MakeVector":
            return new MakeVector()
        case "Cosine":
            return new Cosine()
        case "CosineH":
            return new CosineH()
        case "SampleColor":
            return new SampleColor()
        case "QuadUV":
            return new QuadUV()
        case "FragCoord":
            return new FragCoord()
        case "SineH":
            return new SineH()

        case "DDX":
            return new DDX()

        case "DDY":
            return new DDY()

        case "Normalize":
            return new Normalize()

        case "Reflect":
            return new Reflect()

        case "Refract":
            return new Refract()

        case "SceneColor":
            return new SceneColor()

        case "Pow":
            return new Pow()

        case "Saturation":
            return new Saturation()

        case "Saturate":
            return new Saturate()

        case "Clamp":
            return new Clamp()

        case "OneMinus":
            return new OneMinus()

        case "Vec2":
            return new Vec2()

        case "Vec3":
            return new Vec3()

        case "Vec4":
            return new Vec4()

        case "BreakVector":
            return new BreakVector()

        case "DotProduct":
            return new DotProduct()

        case "LinearInterpolate":
            return new LinearInterpolate()

        case "PerlinNoise":
            return new PerlinNoise()

        case "TextureCoords":
            return new TextureCoords()

        case "CameraCoords":
            return new CameraCoords()

        case "AbsoluteWorldPosition":
            return new AbsoluteWorldPosition()

        case "NormalVector":
            return new NormalVector()

        case "ToTangentSpace":
            return new ToTangentSpace()

        case "ViewDirection":
            return new ViewDirection()

        case "ParallaxOcclusionMapping":
            return new ParallaxOcclusionMapping()

        case "Add":
            return new Add()

        case "TextureSample":
            return new TextureSample()

        case "Float":
            return new Float()
        case "ElapsedTime":
            return new ElapsedTime()
        case "Multiply":
            return new Multiply()

        case "Sine":
            return new Sine()
        case "Divide":
            return new Divide()
        case "Min":
            return new Min()
        case "Max":
            return new Max()
        case "RGB":
            return new RGB()
    }
}