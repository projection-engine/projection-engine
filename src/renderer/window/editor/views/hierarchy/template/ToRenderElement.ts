import EditorEntity from "../../../../../engine/tools/EditorEntity"
import Component from "../../../../../engine/core/components/Component"

export default interface HierarchyToRenderElement{
    node:EditorEntity
    component?:Component
    depth:number
}
