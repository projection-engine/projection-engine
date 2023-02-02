interface ContextMenuOption{
    divider?:boolean
    onClick?:Function
    callback?:Function
    label?:string
    require?:string[]
    accelerator?:string
    children?:ContextMenuOption[]
}

export default ContextMenuOption