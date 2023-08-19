import Component from "@engine-core/lib/components/Component"

export default [
	Component.terrainInstance("TERRAIN", "terrainID"),
	Component.materialInstance("MATERIAL", "materialID"),
	Component.boolean("HAS_COLLISION", "hasCollision")
]
