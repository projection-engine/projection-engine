import {boolean, materialInstance, terrainInstance} from "./prop-types";

export default [
	terrainInstance("TERRAIN", "terrainID"),
	materialInstance("MATERIAL", "materialID"),
	boolean("HAS_COLLISION", "hasCollision")
]
