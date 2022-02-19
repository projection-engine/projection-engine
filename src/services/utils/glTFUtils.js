import {WebWorker} from "../workers/WebWorker";
import {mat4, quat} from "gl-matrix";
import Transformation from "../engine/utils/Transformation";

export function nodeParser(node, allNodes, parentTransform) {
    let res = []
    let children = node.children && node.children.length > 0 ? allNodes
            .map((n, index) => {
                if (node.children.includes(index))
                    return {...allNodes[index], index}
                else
                    return undefined
            }).filter(e => e !== undefined)
        :
        []


    let parsedNode = {
        name: node.name,
        meshIndex: node.mesh,
        scaling: [1, 1, 1],
        rotation: [0, 0, 0],
        translation: [0, 0, 0],
        children: []
    }

    if (node.matrix) {
        parsedNode = {
            ...parsedNode,
            ...extractTransformations(node.matrix)
        }
    } else {
        let translation = node.translation,
            rotation = node.rotation,
            scale = node.scale
        if (!translation)
            translation = [0, 0, 0]
        if (!scale)
            scale = [1, 1, 1]
        if (!rotation)
            rotation = [0, 0, 0, 1]


        parsedNode.scaling = scale
        parsedNode.rotation = quaternionToRotation(rotation)
        parsedNode.translation = translation

    }

    let transformationMatrix = Transformation.transform(parsedNode.translation, parsedNode.rotation, parsedNode.scaling)
    if (parentTransform) {
        mat4.multiply(
            transformationMatrix,
            parentTransform,
            transformationMatrix
        )
        parsedNode = {
            ...parsedNode,
            ...extractTransformations(transformationMatrix)
        }
    }
    console.log(transformationMatrix)


    children = children
        .map(child => {
            return nodeParser(child, allNodes, transformationMatrix)
        })
        .flat()

    res.push(...children)
    if (node.mesh !== undefined)
        res.push(parsedNode)
    return res
}


function extractTransformations(mat) {
    let translation = [0, 0, 0],
        rotation = [0, 0, 0, 1],
        scaling = [1, 1, 1]

    mat4.getTranslation(translation, mat)
    mat4.getRotation(rotation, mat)
    mat4.getScaling(scaling, mat)

    return {
        translation,
        rotation: quaternionToRotation(rotation),
        scaling
    }
}

function quaternionToRotation(rotation) {
    let x, y, z
    x = quat.getAxisAngle([1, 0, 0], rotation)
    y = quat.getAxisAngle([0, 1, 0], rotation)
    z = quat.getAxisAngle([0, 0, 1], rotation)

    return [x, y, z]
}


export function getPrimitives(mesh, materials = []) {
    const primitives = mesh.primitives;

    primitives.forEach(primitive => {
        primitive.attributes = Object.keys(primitive.attributes).map(name => ({
            name,
            index: primitive.attributes[name]
        }))

        if (typeof primitive.material !== "undefined") {
            primitive.material = materials[primitive.material];
        }
    });
    return primitives.map(p => {
        const vert = p.attributes.find(d => d.name === 'POSITION')
        const norm = p.attributes.find(d => d.name === 'NORMAL')
        const tang = p.attributes.find(d => d.name === 'TANGENT')
        const uv = p.attributes.find(d => d.name === 'TEXCOORD_0')

        return {
            indices: p.indices,
            vertices: vert ? vert.index : -1,
            tangents: tang ? tang.index : -1,
            normals: norm ? norm.index : -1,
            uvs: uv ? uv.index : -1
        }
    })
}

export function unpackBufferViewData(
    buffers,
    bufferViews,
    length,
    elementBytesLength,
    typedGetter,
    bufferView
) {

    let bufferId = bufferViews[bufferView].buffer;
    let offset = bufferViews[bufferView].byteOffset;

    let dv = buffers[bufferId];
    return Array.from({
        length
    }).map((el, i) => {
        let loopOffset = offset + Math.max(0, elementBytesLength * i);
        return dv[typedGetter](loopOffset, true);
    })
}


export async function getBufferData(str, asBinary) {
    let byteCharacters = asBinary ? str : window.atob(str.replace('data:application/octet-stream;base64,', ''));

    let dv = new DataView(new ArrayBuffer(byteCharacters.length));

    Array.from(byteCharacters).forEach((char, i) => {
        dv.setUint8(i, char.charCodeAt(0));
    });

    return dv;
}