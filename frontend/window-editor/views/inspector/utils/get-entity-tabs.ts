import getComponentIcon from "./get-component-icon";
import getComponentLabel from "./get-component-label";
import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";

export default function getEntityTabs(components) {
    return [

        {icon: "settings", label: LOCALIZATION_EN.ENTITY_PROPERTIES, index: -1},
        {icon: "code", label: LOCALIZATION_EN.CUSTOM_COMPONENTS, index: -2},
        {divider: true},
        ...components.map((c, i) => ({
            icon: getComponentIcon(c[0]),
            label: getComponentLabel(c[0]),
            index: i
        }))
    ]
}