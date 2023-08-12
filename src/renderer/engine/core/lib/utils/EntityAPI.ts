import {Components,} from "@engine-core/engine.enum";

const COMPONENT_TRIGGER_UPDATE = [Components.LIGHT, Components.MESH]
const ENTITY_TYPED_ATTRIBUTES = [
    "_translation",
    "__changedBuffer",
    "_rotationQuaternion",
    "_rotationType",
    "_rotationEuler",
    "_rotationQuaternionFinal",
    "matrix",
    "absoluteTranslation",
    "_scaling",
    "baseTransformationMatrix",
    "pivotPoint",
    "previousModelMatrix",
    "distanceFromCamera",
    "__cullingMetadata",
]
const excludedKeys = [
	...ENTITY_TYPED_ATTRIBUTES,
	"components",
	"parent",
	"matrix",
	"_props",
	"id"
]
export default class EntityAPI {




}
