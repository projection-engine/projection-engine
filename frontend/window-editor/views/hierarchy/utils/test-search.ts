
export default function testSearch(node, f:string, s:string){
    return (s && node.name.includes(s) || !s) &&
        (f && node.components.get(f) != null || !f)
}
