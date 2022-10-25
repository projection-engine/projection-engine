import getComponentIcon from "./get-component-icon";
import getComponentLabel from "./get-component-label";

export default function getEntityTabs(components, scripts) {
    return [
        {icon: "settings", label: "Metadata", index: -2},
        {icon: "transform", label: "Transformation", index: -1},
        ...components.map((c, i) => ({
            icon: getComponentIcon(c[0]),
            label: getComponentLabel(c[0]),
            index: i
        })),
        ...scripts.map((s, i) => ({
            isFirstScript: i === 0,
            icon: "code",
            label: s._name,
            index: components.length  + i
        }))
    ]
}