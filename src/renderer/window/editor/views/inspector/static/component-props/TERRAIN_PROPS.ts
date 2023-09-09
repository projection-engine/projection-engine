import {boolean, group, imageTexture, materialInstance, meshInstance, terrainInstance} from "./prop-types";

export default [
    group("RENDERING", [
        imageTexture("TERRAIN_HEIGHTMAP", "terrainID"),
    ]),
    group("CONTRIBUTION", [
        boolean("CASTS_SHADOWS", "castsShadows"),
    ])
]
