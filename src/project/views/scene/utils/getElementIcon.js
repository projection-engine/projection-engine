import COMPONENTS from "../../../engine/templates/COMPONENTS";

export default function getElementIcon(components) {
    switch (true) {
        case components[COMPONENTS.SKYBOX] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>cloud</span>
            )
        case components[COMPONENTS.MESH] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>view_in_ar</span>
            )
        case components[COMPONENTS.POINT_LIGHT] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>lightbulb</span>
            )
        case components[COMPONENTS.SPOT_LIGHT] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>flashlight_on</span>
            )
        case components[COMPONENTS.DIRECTIONAL_LIGHT] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>light_mode</span>
            )

        case components[COMPONENTS.FOLDER] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>folder</span>
            )
        case components[COMPONENTS.CUBE_MAP] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>panorama_photosphere</span>
            )
        case components[COMPONENTS.CAMERA] !== undefined:
            return (
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>videocam</span>
            )
        default:
            return
    }
}