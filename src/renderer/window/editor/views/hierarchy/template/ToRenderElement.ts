import Entity from "../../../../../engine/core/instances/Entity"
import Component from "../../../../../engine/core/instances/components/Component"

export default interface HierarchyToRenderElement{
    node:Entity
    component?:Component
    depth:number
}
