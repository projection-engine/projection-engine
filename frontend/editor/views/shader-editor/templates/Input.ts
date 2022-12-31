export interface Input {
    [key: string]: any

    onChange?: Function
    label: string
    key: string
    accept?: string[]
    type?: string
    disabled?: boolean
}