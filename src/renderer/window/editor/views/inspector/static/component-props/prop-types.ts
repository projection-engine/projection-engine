import COMPONENT_PROP_TYPES from "../../../../static/COMPONENT_PROP_TYPES";
import AbstractComponent from "@engine-core/lib/components/AbstractComponent";

export function group(label, children, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {
        type: COMPONENT_PROP_TYPES.GROUP,
        label,
        disabledIf,
        children: Array.isArray(children) ? children : []
    }
}

export function number(label: string, key: string, max?: number, min?: number, increment?: number, isAngle?: boolean, realtime?: boolean, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {
        label,
        max,
        min,
        increment: increment ? increment : .001,
        type: COMPONENT_PROP_TYPES.NUMBER,
        key,
        isAngle,
        realtime: !!realtime,
        disabledIf
    }
}

export function array(labels: string[], key: string, increment, max?: number, min?: number, isAngle?: boolean, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {labels, max, min, increment, type: COMPONENT_PROP_TYPES.ARRAY, key, disabledIf, isAngle}
}

export function string(label: string, key: string, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {type: COMPONENT_PROP_TYPES.STRING, label, key, disabledIf}
}

export function options(key: string, options?: {
    label: string,
    value: any
}[], disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {
        type: COMPONENT_PROP_TYPES.OPTIONS,
        options,
        key,
        disabledIf
    }
}

export function color(label: string, key: string, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {type: COMPONENT_PROP_TYPES.COLOR, label, key, disabledIf}
}

export function boolean(label: string, key: string, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {type: COMPONENT_PROP_TYPES.BOOLEAN, label, key, disabledIf}
}

export function imageTexture(label: string, key: string, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {type: COMPONENT_PROP_TYPES.IMAGE, label, key, disabledIf}
}

export function materialInstance(label: string, key: string, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {type: COMPONENT_PROP_TYPES.MATERIAL, label, key, disabledIf}
}

export function terrainInstance(label: string, key: string, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {type: COMPONENT_PROP_TYPES.TERRAIN, label, key, disabledIf}
}

export function meshInstance(label: string, key: string, disabledIf?: GenericNonVoidFunctionWithP<AbstractComponent, boolean> | string): ComponentValueGeneric {
    return {type: COMPONENT_PROP_TYPES.MESH, label, key, disabledIf}
}
