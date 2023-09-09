import EditorEntity from "../../../../../engine/tools/EditorEntity"
import AbstractComponent from "@engine-core/lib/components/AbstractComponent"

export default interface HierarchyToRenderElement{
    node:EditorEntity
    component?:AbstractComponent
    depth:number
}
