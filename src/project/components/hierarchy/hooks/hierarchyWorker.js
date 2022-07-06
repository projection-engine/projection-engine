self.onmessage = ({data: {entities, COMPONENTS, searchedEntity}}) => {
    const parseStr = (str) => {
        return str.toLowerCase().replace(/\s/g,"")
    }
    console.log(entities)
    const search = parseStr(searchedEntity)


    function getElementType(components, isBP) {
        if (isBP) return "ScriptView"

        switch (true) {
        case components[COMPONENTS.MESH] !== undefined:
            return "Mesh instance"
        case components[COMPONENTS.POINT_LIGHT] !== undefined:
            return "Point light"
        case components[COMPONENTS.SPOT_LIGHT] !== undefined:
            return "Spot light"
        case components[COMPONENTS.DIRECTIONAL_LIGHT] !== undefined:
            return "Directional light"
        case components[COMPONENTS.FOLDER] !== undefined:
            return "Folder"
        case components[COMPONENTS.PROBE] !== undefined:
            return "Probe"

        default:
            return
        }
    }

    function getElementIcon(components) {
        switch (true) {

        case components[COMPONENTS.MESH] !== undefined:
            return "view_in_ar"
        case components[COMPONENTS.POINT_LIGHT] !== undefined:
            return "lightbulb"
        case components[COMPONENTS.SPOT_LIGHT] !== undefined:
            return "flashlight_on"
        case components[COMPONENTS.DIRECTIONAL_LIGHT] !== undefined:
            return "light_mode"
        case components[COMPONENTS.FOLDER] !== undefined:
            return "inventory_2"

        case components[COMPONENTS.CAMERA] !== undefined:
            return "videocam"
        case components[COMPONENTS.LINE] !== undefined:
            return "arrow_right_alt"
        case components[COMPONENTS.PROBE] !== undefined:
            return "lens_blur"
        default:
            return
        }
    }

    function mapToView(current) {
        return {
            id: current.id,
            label: current.name,
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
        response = entities.map(t => mapToView(t))
    else
        response = entities.filter(t => parseStr(t.name).includes(search)).map(t => mapToView(t))
    self.postMessage(response)
}