import Node from "./Node"

export default class Comment extends Node {
    name = "New Comment"
    width = 100
    height = 100
    color = [150, 150, 150, .5]

    constructor(width, height, smallestX, smallestY) {
        super([], [])

        this.x = smallestX
        this.y = smallestY

        this.width = width
        this.height = height
    }

    get isComment() {
        return true
    }
}