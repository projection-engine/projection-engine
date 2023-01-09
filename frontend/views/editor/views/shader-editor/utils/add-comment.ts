import Canvas from "../libs/Canvas";
import Comment from "../templates/Comment";

export default function addComment(canvasAPI: Canvas) {
    let smallestX: number | undefined,
        smallestY: number | undefined,
        width: number | undefined,
        height: number | undefined,
        biggestX: number | undefined,
        biggestY: number | undefined


    canvasAPI.selectionMap
        .forEach(n => {
            if (n instanceof Comment)
                return
            if (!smallestX || n.x < smallestX)
                smallestX = n.x
            if (!smallestY || n.y < smallestY)
                smallestY = n.y

            if (!biggestX || n.x + n.width > biggestX)
                biggestX = n.x + n.width
            if (!biggestY || n.y + n.height > biggestY)
                biggestY = n.y + n.height
        })


    width = 8 + (biggestX - smallestX)
    height = 40 + (biggestY - smallestY)

    smallestX -= 4
    smallestY -= 36

    const comment = new Comment(smallestX, smallestY)
    comment.width = width
    comment.height = height
    canvasAPI.comments.push(comment)
    canvasAPI.clear()
}