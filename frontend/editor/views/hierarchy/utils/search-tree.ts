import HierarchyToRenderElement from "../template/ToRenderElement"
import testSearch from "./test-search"

export default function searchTree(start:number, end:number, arr: HierarchyToRenderElement[], toSearch:HierarchyToRenderElement[], search:string, filteredComponent:string) {
	for(let i =end; i > start; i--){
		const data = toSearch[i]
		if(!data?.node)
			break
		const searchMatches = testSearch(filteredComponent, search, data.node)
		if(searchMatches)
			break
		else
			arr[i] = undefined
	}
}
