import getBezierCurve from "../utils/get-bezier-curve";
import ShaderEditorTools from "./ShaderEditorTools";

export default class ShaderLink {
    targetRef
    sourceRef

    #targetElement
    #sourceElement
    #canvasElement
    #linkElement

    CONTEXT_ID
    identifier

    static getPattern(l) {
        return l.target + "-" + l.source
    }

    constructor(target, source, CONTEXT_ID) {
        this.targetRef = target
        this.sourceRef = source
        this.CONTEXT_ID = CONTEXT_ID

        this.target = this.targetRef.id + this.targetRef.attribute.key
        this.source = this.sourceRef.id + this.sourceRef.attribute.key
        this.identifier = ShaderLink.getPattern(this)

        this.#sourceElement = document.getElementById(this.source)
        this.#targetElement = document.getElementById(this.target)
        this.#canvasElement = document.getElementById(CONTEXT_ID)
        this.#linkElement = document.getElementById(this.identifier)

        this.targetKey = this.targetRef.attribute.key
        this.sourceKey = this.sourceRef.attribute.key
        this.sourceType = this.sourceRef.attribute.type
        this.targetType = this.targetRef.attribute.type


    }

    updatePath() {
        if (!this.#sourceElement)
            this.#sourceElement = document.getElementById(this.source)
        if (!this.#targetElement)
            this.#targetElement = document.getElementById(this.target)
        if (!this.#linkElement)
            this.#linkElement = document.getElementById(this.identifier)
        if (!this.#canvasElement)
            this.#canvasElement = document.getElementById(this.CONTEXT_ID)
        
        if (!this.#targetElement || !this.#sourceElement || !this.#canvasElement || !this.#linkElement)
            return
        let canvasBBox = this.#canvasElement.getBoundingClientRect()
        const bounding = {
            x: this.#canvasElement.scrollLeft - canvasBBox.left,
            y: this.#canvasElement.scrollTop - canvasBBox.top
        }

        const scale = ShaderEditorTools.scale
        const sourceBBox = this.#sourceElement.getBoundingClientRect(), targetBBox = this.#targetElement.getBoundingClientRect()

        const OFFSET = 7.5
        const curve = getBezierCurve(
            {
                x: (sourceBBox.x + bounding.x + OFFSET) / scale,
                y: (sourceBBox.y + bounding.y + OFFSET) / scale
            },
            {
                x1: (targetBBox.x + bounding.x + OFFSET) / scale,
                y1: (targetBBox.y + bounding.y + OFFSET) / scale
            })

        if (this.#linkElement.getAttribute("d") !== curve)
            this.#linkElement.setAttribute("d", curve)
    }
}