import Float from "../../../../src/project/components/blueprints/nodes/math/Float"
import Material from "../../../../src/project/components/blueprints/nodes/Material"
import EmbeddedTextureSample from "../../../../src/project/components/blueprints/nodes/EmbeddedTextureSample"
import compiler from "../../../../src/project/components/blueprints/utils/compiler/compiler"
import Vec3 from "../../../../src/project/components/blueprints/nodes/vec/Vec3"

export default async function prepareMaterial({
    emissive,
    albedo,
    normal,
    roughness,
    metallic,
    ao
}){
    const material = new Material()
    material.x = 1000
    material.y = 100
    const nodes = []
    const links = []
    let data

    data = (typeof emissive === "number" ? newFactor : newTexture)(emissive, "emissive", material, 0)
    nodes.push(data.node)
    links.push(data.link)

    data = (typeof albedo === "number" ? newFactor : newTexture)(albedo, "albedo", material, 1)
    nodes.push(data.node)
    links.push(data.link)

    data = (typeof roughness === "number" ? newFactor : newTexture)(roughness, "roughness", material, 2)
    nodes.push(data.node)
    links.push(data.link)
    
    data = (typeof metallic === "number" ? newFactor : newTexture)(metallic, "metallic", material, 3)
    nodes.push(data.node)
    links.push(data.link)
    
    data = (typeof ao === "number" ? newFactor : newTexture)(ao, "ao", material, 4)
    nodes.push(data.node)
    links.push(data.link)

    if(normal !== null){
        data = newTexture(normal, "normal", material, 5)
        nodes.push(data.node)
        links.push(data.link)
    }
    return await compiler(nodes, links)
}

function newTexture(val, key, material, index){
    const node = new EmbeddedTextureSample()
    node.texture = val
    node.y = index * 250
    return {
        node,
        link: {
            source: {
                attribute: node.output[0],
                id: node.id
            },
            target: {
                attribute: material.inputs.find(n => n.key === key),
                id: material.id
            }
        }
    }
}
function newFactor(val, key, material, index){
    const node = typeof val === "object" ? new Vec3() : new Float()
    node.v = val
    node.y = index * 250
    return {
        node,
        link: {
            source: {
                attribute: node.output[0],
                id: node.id
            },
            target: {
                attribute: material.inputs.find(n => n.key === key),
                id: material.id
            }
        }
    }
}