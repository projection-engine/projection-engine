import COMPONENTS from "../../../services/engine/shared/templates/COMPONENTS";

export default function getElementType(components, isBP){
    if(isBP)
        return 'Blueprint'

    switch (true) {
        case components[COMPONENTS.SKYBOX] !== undefined:
            return 'Skybox'
        case components[COMPONENTS.MESH] !== undefined:
            return 'Mesh instance'
        case components[COMPONENTS.POINT_LIGHT] !== undefined:
            return 'Point light'
        case components[COMPONENTS.SPOT_LIGHT] !== undefined:
            return 'Spot light'
        case components[COMPONENTS.DIRECTIONAL_LIGHT] !== undefined:
            return 'Directional light'

        case components[COMPONENTS.FOLDER] !== undefined:
            return 'Folder'
        case components[COMPONENTS.CUBE_MAP] !== undefined:
            return 'Cube map'
        case components[COMPONENTS.SKYLIGHT] !== undefined:
            return 'Skylight'

        default:
            return
    }
}