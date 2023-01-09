import getComponentIcon from "./get-component-icon";
import getComponentLabel from "./get-component-label";

export default function getEntityTabs(components) {
    return [
        {icon: "transform", label: "Transformation", index: -1},
        {icon: "settings", label: "Metadata", index: -2},
        {icon: "code", label: "Custom components ", index: -3},
        {divider: true},
        ...components.map((c, i) => ({
            icon: getComponentIcon(c[0]),
            label: getComponentLabel(c[0]),
            index: i
        }))
    ]
}