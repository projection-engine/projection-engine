self.onmessage = ({data: {entities, COMPONENTS, searchedEntity}}) => {
    const parseStr = (str) => {
        return str.toLowerCase().replace(/\s/g,"")
    }
    const search = parseStr(searchedEntity)
    const toFilter =  !search ? entities.filter(d => !d.linkedTo) :entities

    function getElementType(components, isBP) {
        if (isBP) return "ScriptView"

        switch (true) {
        case components.find(c => c === COMPONENTS.MESH) !== undefined:
            return "Mesh instance"
        case components.find(c => c === COMPONENTS.POINT_LIGHT) !== undefined:
            return "Point light"
        case components.find(c => c === COMPONENTS.SPOT_LIGHT) !== undefined:
            return "Spot light"
        case components.find(c => c === COMPONENTS.DIRECTIONAL_LIGHT) !== undefined:
            return "Directional light"
        case components.find(c => c === COMPONENTS.FOLDER) !== undefined:
            return "Folder"
        case components.find(c => c === COMPONENTS.CUBE_MAP) !== undefined:
            return "Cube map"
        case components.find(c => c === COMPONENTS.SKYLIGHT) !== undefined:
            return "Skylight"
        case components.find(c => c === COMPONENTS.PROBE) !== undefined:
            return "Light probe"

        default:
            return
        }
    }

    function getElementIcon(components) {
        switch (true) {
        case components.find(c => c === COMPONENTS.SKYBOX) !== undefined:
            return "cloud"
        case components.find(c => c === COMPONENTS.MESH) !== undefined:
            return "view_in_ar"
        case components.find(c => c === COMPONENTS.POINT_LIGHT) !== undefined:
            return "lightbulb"
        case components.find(c => c === COMPONENTS.SPOT_LIGHT) !== undefined:
            return "flashlight_on"
        case components.find(c => c === COMPONENTS.DIRECTIONAL_LIGHT) !== undefined:
            return "light_mode"
        case components.find(c => c === COMPONENTS.FOLDER) !== undefined:
            return "inventory_2"
        case components.find(c => c === COMPONENTS.CUBE_MAP) !== undefined:
            return "panorama_photosphere"
        case components.find(c => c === COMPONENTS.CAMERA) !== undefined:
            return "videocam"
        case components.find(c => c === COMPONENTS.LINE) !== undefined:
            return "arrow_right_alt"
        case components.find(c => c === COMPONENTS.PROBE) !== undefined:
            return "lens_blur"
        default:
            return
        }
    }

    function mapToView(current) {
        const children =  !search ? entities.filter(f => f.linkedTo === current.id) : []

        return {
            id: current.id,
            label: current.name,
            children:children.map(f => mapToView(f)),
            icon: getElementIcon(current.components),
            type: getElementType(current.components),
            draggable: true,
            hidden: !current.active,
            canBeHidden: true,
            entity: current
        }
    }

    let response
    if(!search)
        response = toFilter.map(t => mapToView(t))
    else
        response = toFilter.filter(t => parseStr(t.name).includes(search)).map(t => mapToView(t))
    self.postMessage(response)
}