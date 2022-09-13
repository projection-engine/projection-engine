import Comment from "../templates/nodes/Comment"
import SelectionStore from "../../../stores/SelectionStore";

export default function addComment(nodes, setNodes) {
    let smallestX,
        smallestY,
        width = 0,
        height = 0,
        biggestX,
        biggestY

    const nodesG = SelectionStore.shaderEditorSelected.map(h => document.getElementById(h)?.parentNode).filter(n => n)
    nodesG
        .forEach(n => {
            const transformation = n
                .getAttribute("transform")
                .replace("translate(", "")
                .replace(")", "")
                .split(" ")


            const cX = parseFloat(transformation[0])
            const cY = parseFloat(transformation[1])
            const cW = parseFloat(n.firstChild.style.width.replace("px", ""))
            const cH = parseFloat(n.firstChild.style.height.replace("px", ""))
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