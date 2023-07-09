import Entity from "../../../../../engine-core/core/instances/Entity"
import Component from "../../../../../engine-core/core/instances/components/Component"

export default interface HierarchyToRenderElement{
    node:Entity
    component?:Component
    depth:number
}
