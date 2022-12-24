import ContextMenuOptions from "./ContextMenuOptions";
import MutableObject from "../../../../engine-core/MutableObject";
import MappedOption from "./MappedOption";

interface ContextMenuTarget {

    id: string|null
    options: ContextMenuOptions[]
    triggers?: string[]
    onFocus: Function
    template: MappedOption[]

}

export default ContextMenuTarget