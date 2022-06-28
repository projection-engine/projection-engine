import Float from "../../../../src/project/components/blueprints/nodes/math/Float"
import Material from "../../../../src/project/components/blueprints/nodes/Material"
import EmbeddedTextureSample from "../../../../src/project/components/blueprints/nodes/EmbeddedTextureSample"
import Vec3 from "../../../../src/project/components/blueprints/nodes/vec/Vec3"

function check(val){
    return typeof val === "number" || Array.isArray(val)
}
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
    let data, index = 0

    if(emissive !== undefined) {
        data = (check(emissive) ? newFactor : newTexture)(emissive, "emissive", material, index)
        nodes.push(data.node)
        links.push(data.link)
        index++
    }

    if(albedo !== undefined) {
        data = (check(albedo)  ? newFactor : newTexture)(albedo, "al", material, index)
        nodes.push(data.node)
        links.push(data.link)
        index++
    }

    if(roughness !== undefined) {
        data = (check(roughness)  ? newFactor : newTexture)(roughness, "roughness", material, index)
        nodes.push(data.node)
        links.push(data.link)
        index++
    }

    if(metallic !== undefined) {
        data = (check(metallic)  ? newFactor : newTexture)(metallic, "metallic", material, index)
        nodes.push(data.node)
        links.push(data.link)
        index++
    }
    if(ao !== undefined) {
        data = (check(ao) ? newFactor : newTexture)(ao, "ao", material, index)
        nodes.push(data.node)
        links.push(data.link)
        index++
    }
    if(normal !== undefined){
        data = newTexture(normal, "normal", material, index)
        nodes.push(data.node)
        links.push(data.link)
        index++
    }

    return {
        nodes: nodes.map(n => ({...n, instance: n.constructor.name})),
        links: links
    }
}

function newTexture({id}, key, material, index){
    const node = new EmbeddedTextureSample()
    node.texture = {registryID: id}
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