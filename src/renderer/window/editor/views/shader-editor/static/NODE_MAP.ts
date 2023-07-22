import MakeVector from "../templates/nodes/vec/MakeVector"
import Cosine from "../templates/nodes/math/Cosine"
import CosineH from "../templates/nodes/math/CosineH"
import SineH from "../templates/nodes/math/SineH"
import DDX from "../templates/nodes/math/DDX"
import DDY from "../templates/nodes/math/DDY"
import Normalize from "../templates/nodes/math/Normalize"
import Reflect from "../templates/nodes/math/Reflect"
import Refract from "../templates/nodes/math/Refract"
import SceneColor from "../templates/nodes/static/SceneColor"
import Pow from "../templates/nodes/math/Pow"
import Saturation from "../templates/nodes/math/Saturation"
import Saturate from "../templates/nodes/math/Saturate"
import Clamp from "../templates/nodes/math/Clamp"
import OneMinus from "../templates/nodes/math/OneMinus"
import Vec2 from "../templates/nodes/vec/Vec2"
import Vec3 from "../templates/nodes/vec/Vec3"
import Vec4 from "../templates/nodes/vec/Vec4"
import BreakVector from "../templates/nodes/vec/BreakVector"
import DotProduct from "../templates/nodes/vec/DotProduct"
import LinearInterpolate from "../templates/nodes/vec/LinearInterpolate"
import PerlinNoise from "../templates/nodes/math/PerlinNoise"
import TextureCoords from "../templates/nodes/static/TextureCoords"
import CameraCoords from "../templates/nodes/static/CameraCoords"
import AbsoluteWorldPosition from "../templates/nodes/static/AbsoluteWorldPosition"
import NormalVector from "../templates/nodes/static/NormalVector"
import ToTangentSpace from "../templates/nodes/static/ToTangentSpace"
import ViewDirection from "../templates/nodes/static/ViewDirection"
import ParallaxOcclusionMapping from "../templates/nodes/ParallaxOcclusionMapping"
import Add from "../templates/nodes/math/Add"
import TextureSample from "../templates/nodes/TextureSample"
import Float from "../templates/nodes/math/Float"
import ElapsedTime from "../templates/nodes/static/ElapsedTime"
import Multiply from "../templates/nodes/math/Multiply"
import Sine from "../templates/nodes/math/Sine"
import Tan from "../templates/nodes/math/Tan"
import Divide from "../templates/nodes/math/Divide"
import Min from "../templates/nodes/math/Min"
import Max from "../templates/nodes/math/Max"
import RGB from "../templates/nodes/RGB"
import FragCoord from "../templates/nodes/static/FragCoord"
import QuadUV from "../templates/nodes/static/QuadUV"
import SampleColor from "../templates/nodes/SampleColor"
import Fresnel from "../templates/nodes/math/Fresnel"
import GaussianBlur from "../templates/nodes/GaussianBlur"
import Material from "../templates/nodes/Material"


export default {
	Material,
	[Material.signature]: Material,
	Tan,
	[Tan.signature]: Tan,
	MakeVector,
	[MakeVector.signature]: MakeVector,
	Cosine,
	[Cosine.signature]: Cosine,
	CosineH,
	[CosineH.signature]: CosineH,
	SineH,
	[SineH.signature]: SineH,
	DDX,
	[DDX.signature]: DDX,
	DDY,
	[DDY.signature]: DDY,
	Normalize,
	[Normalize.signature]: Normalize,
	Reflect,
	[Reflect.signature]: Reflect,
	Refract,
	[Refract.signature]: Refract,
	SceneColor,
	[SceneColor.signature]: SceneColor,
	Pow,
	[Pow.signature]: Pow,
	Saturation,
	[Saturation.signature]: Saturation,
	Saturate,
	[Saturate.signature]: Saturate,
	Clamp,
	[Clamp.signature]: Clamp,
	OneMinus,
	[OneMinus.signature]: OneMinus,
	Vec2,
	[Vec2.signature]: Vec2,
	Vec3,
	[Vec3.signature]: Vec3,
	Vec4,
	[Vec4.signature]: Vec4,
	BreakVector,
	[BreakVector.signature]: BreakVector,
	DotProduct,
	[DotProduct.signature]: DotProduct,
	LinearInterpolate,
	[LinearInterpolate.signature]: LinearInterpolate,
	PerlinNoise,
	[PerlinNoise.signature]: PerlinNoise,
	TextureCoords,
	[TextureCoords.signature]: TextureCoords,
	CameraCoords,
	[CameraCoords.signature]: CameraCoords,
	AbsoluteWorldPosition,
	[AbsoluteWorldPosition.signature]: AbsoluteWorldPosition,
	NormalVector,
	[NormalVector.signature]: NormalVector,
	ToTangentSpace,
	[ToTangentSpace.signature]: ToTangentSpace,
	ViewDirection,
	[ViewDirection.signature]: ViewDirection,
	ParallaxOcclusionMapping,
	[ParallaxOcclusionMapping.signature]: ParallaxOcclusionMapping,
	Add,
	[Add.signature]: Add,
	TextureSample,
	[TextureSample.signature]: TextureSample,
	Float,
	[Float.signature]: Float,
	ElapsedTime,
	[ElapsedTime.signature]: ElapsedTime,
	Multiply,
	[Multiply.signature]: Multiply,
	Sine,
	[Sine.signature]: Sine,
	Divide,
	[Divide.signature]: Divide,
	Min,
	[Min.signature]: Min,
	Max,
	[Max.signature]: Max,
	RGB,
	[RGB.signature]: RGB,
	FragCoord,
	[FragCoord.signature]: FragCoord,
	QuadUV,
	[QuadUV.signature]: QuadUV,
	SampleColor,
	[SampleColor.signature]: SampleColor,
	Fresnel,
	[Fresnel.signature]: Fresnel,
	GaussianBlur,
	[GaussianBlur.signature]: GaussianBlur,
}