import ShaderNode from "../ShaderNode"

export default class Comment extends ShaderNode {
    name = "New Comment"
    width = 100
    height = 100
    color = [150, 150, 150, .5]

    constructor(width?:number, height?:number, smallestX?:number, smallestY?:number) {
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