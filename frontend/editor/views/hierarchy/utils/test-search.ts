export default function testSearch(filteredComponent, search, node){
	return  (!search || search && node.name.includes(search)) && (!filteredComponent || filteredComponent && node.components.has(filteredComponent))
}