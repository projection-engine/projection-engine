import EditorEntity from "../../../../../engine/tools/EditorEntity"
import Component from "@engine-core/lib/components/Component"

export default interface HierarchyToRenderElement{
    node:EditorEntity
    component?:Component
    depth:number
}
