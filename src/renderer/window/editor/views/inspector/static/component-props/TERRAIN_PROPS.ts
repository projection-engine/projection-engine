import {boolean, group, imageTexture, number} from "./prop-types";

export default [
    group("RENDERING", [
        imageTexture("TERRAIN_HEIGHTMAP", "terrainID"),
        number("HEIGHT_SCALE", "heightScale"),
    ]),
    group("CONTRIBUTION", [
        boolean("CASTS_SHADOWS", "castsShadows"),
    ])
]
