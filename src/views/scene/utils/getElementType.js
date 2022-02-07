export default function getElementType(components){
    switch (true) {
        case components.SkyboxComponent !== undefined:
            return 'Skybox'
        case components.MeshComponent !== undefined:
            return 'Mesh instance'
        case components.PointLightComponent !== undefined:
            return 'Point light'
        case components.SpotLightComponent !== undefined:
            return 'Spot light'
        case components.DirectionalLightComponent !== undefined:
            return 'Directional light'

        case components.FolderComponent !== undefined:
            return 'Folder'
        case components.CubeMapComponent !== undefined:
            return 'Cube map'
        default:
            return
    }
}