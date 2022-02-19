import getElementIcon from "./getElementIcon";
import getElementType from "./getElementType";

export default function mapToView(current, entities, setSelected) {
    return {
        id: current.id,
        label: current.name,
        onClick: (e) => {
            setSelected(current.id, e)
        },
        children: entities.filter(f => f.linkedTo === current.id).map(f => mapToView(f, entities, setSelected)),
        icon: getElementIcon(current.components),
        type: getElementType(current.components)
    }
}