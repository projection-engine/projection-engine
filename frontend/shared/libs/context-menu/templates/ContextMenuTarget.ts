import ContextMenuOptions from "./ContextMenuOptions";
import MutableObject from "../../../../../engine-core/MutableObject";
import MappedOption from "./MappedOption";

interface ContextMenuTarget {

    id:string
        options:ContextMenuOptions[]
        triggers?: string[]
        onFocus:Function
        metadata?:MutableObject
        template: MappedOption[]

}

export default ContextMenuTarget