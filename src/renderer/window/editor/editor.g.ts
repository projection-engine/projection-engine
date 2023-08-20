interface ViewTabItem {
    color: number[]
    type: string
    id?: string
    index?: number
    originalIndex?: number
    name?: string
    icon?: string
}

interface ComponentValueGeneric {
    [key: string]: any

    type: string
    label?: string
    key?: string
    disabledIf?: string | GenericNonVoidFunctionWithP<IComponent, boolean>
}
