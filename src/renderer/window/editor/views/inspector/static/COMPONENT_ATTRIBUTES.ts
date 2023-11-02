import {Components} from "@engine-core/engine.enum";
import TERRAIN_PROPS from "./component-props/TERRAIN_PROPS";
import CULLING_COMPONENT_PROPS from "./component-props/CULLING_COMPONENT_PROPS";
import RIGID_BODY_PROPS from "./component-props/RIGID_BODY_PROPS";
import DECAL_PROPS from "./component-props/DECAL_PROPS";
import PHYSICS_COLLIDER_PROPS from "./component-props/PHYSICS_COLLIDER_PROPS";
import SPRITE_PROPS from "./component-props/SPRITE_PROPS";
import ATMOSPHERE_PROPS from "./component-props/ATMOSPHERE_PROPS";
import CAMERA_PROPS from "./component-props/CAMERA_PROPS";
import MESH_PROPS from "./component-props/MESH_PROPS";
import LIGHT_PROBE_PROPS from "./component-props/LIGHT_PROBE_PROPS";
import LIGHT_PROPS from "./component-props/LIGHT_PROPS";

export default {
    [Components.MESH]: MESH_PROPS,
    [Components.CAMERA]: CAMERA_PROPS,
    [Components.ATMOSPHERE]: ATMOSPHERE_PROPS,
    [Components.SPRITE]: SPRITE_PROPS,
    [Components.PHYSICS_COLLIDER]: PHYSICS_COLLIDER_PROPS,
    [Components.DECAL]: DECAL_PROPS,
    [Components.RIGID_BODY]: RIGID_BODY_PROPS,
    [Components.CULLING]: CULLING_COMPONENT_PROPS,
    [Components.TERRAIN]: TERRAIN_PROPS,
    [Components.LIGHT]: LIGHT_PROPS,
    [Components.LIGHT_PROBE]: LIGHT_PROBE_PROPS
}
