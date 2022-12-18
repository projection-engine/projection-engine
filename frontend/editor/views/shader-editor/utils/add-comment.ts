import Comment from "../libs/nodes/Comment"
import SelectionStore from "../../../stores/SelectionStore";
import ShaderNode from "../libs/ShaderNode";

export default function addComment(nodes:ShaderNode[], setNodes:Function) {
    let smallestX:number|undefined,
        smallestY:number|undefined,
        width:number|undefined,
        height:number|undefined,
        biggestX:number|undefined,
        biggestY:number|undefined

    const nodesG = SelectionStore.shaderEditorSelected.map(h => document.getElementById(h)?.parentElement).filter(n => n)
    nodesG
        .forEach(n => {
            const transformation = n
                .getAttribute("transform")
                .replace("translate(", "")
                .replace(")", "")
                .split(" ")

            const child  = n.firstElementChild

            const cX = parseFloat(transformation[0])
            const cY = parseFloat(transformation[1])
            // @ts-ignore
            const cW = parseFloat(child.style.width.replace("px", ""))
            // @ts-ignore
            const cH = parseFloat(child.style.height.replace("px", ""))
            if (!smallestX || cX < smallestX)
                smallestX = cX
            if (!smallestY || cY < smallestY)
                smallestY = cY

            if (!biggestX || cX + cW > biggestX)
                biggestX = cX + cW
            if (!biggestY || cY + cH > biggestY)
                biggestY = cY + cH


        })


    width = 8 + (biggestX - smallestX)
    height = 40 + (biggestY - smallestY)

    smallestX -= 4
    smallestY -= 36

    setNodes([
        ...nodes,
        new Comment(width, height, smallestX, smallestY)
    ])

}