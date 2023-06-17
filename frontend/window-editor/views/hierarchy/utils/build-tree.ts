import HierarchyController from "../../../lib/controllers/HierarchyController"
import searchTree from "./search-tree"
import HierarchyToRenderElement from "../template/ToRenderElement"


export default function buildTree(openTree: { [key: string]: boolean }, search: string, filteredComponent: string): HierarchyToRenderElement[] {

	const hierarchy = HierarchyController.hierarchy
	const data: HierarchyToRenderElement[] = []
	let blockStart = -1
	let minDepth = -1
	let blockEnd = -1
	const hasSearch = search || filteredComponent
	for (let i = 0; i < hierarchy.length; i++) {
		const current = hierarchy[i]
		let node = current.node

		if (hasSearch) {
			data.push(current)
			if (!node)
				continue
			if (blockStart === -1)
				blockStart = i
			if (minDepth === -1)
				minDepth = current.depth

			if (hierarchy[i + 1]?.depth > current.depth && hierarchy[i + 1]?.node)
				continue
			blockEnd = i
			if (blockEnd !== blockStart)
				searchTree(blockStart, blockEnd, data, hierarchy, search, filteredComponent)
			if (minDepth > hierarchy[i + 1]?.depth) {
				blockStart = -1
				minDepth = -1
			}
		} else {
			if (!node) {
				node = current.component.entity
				if (openTree[node.id] && openTree[node.parent.id])
					data.push(current)
				continue
			}
			if (!node.parent || openTree[node.parent?.id])
				data.push(current)
		}
	}
	return hasSearch ? data.filter(e => e !== undefined && e.node !== undefined) : data
}
