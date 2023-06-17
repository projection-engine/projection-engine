import Entity from "../../../../../engine-core/instances/Entity"
import getComponentIcon from "../../../utils/get-component-icon"
import getComponentLabel from "../../../utils/get-component-label"

export default function mapComponents(entity:Entity){
	return entity.allComponents.map(e => ({
		icon: getComponentIcon(e.componentKey),
		label: getComponentLabel(e.componentKey)
	}))
}