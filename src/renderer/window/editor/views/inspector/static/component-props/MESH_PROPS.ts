import {boolean, group, materialInstance, meshInstance} from "./prop-types";

export default [
	group("RENDERING", [
		meshInstance("MESH", "meshID"),
		materialInstance("MATERIAL", "materialID"),
	]),
	group("CONTRIBUTION", [
		boolean("CASTS_SHADOWS", "castsShadows"),
		boolean("CONTRIBUTE_TO_PROBES", "contributeToProbes"),
	])
]
