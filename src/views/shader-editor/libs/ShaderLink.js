export default class ShaderLink {
    targetRef
    sourceRef

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

        this.targetKey = this.targetRef.attribute.key
        this.sourceKey = this.sourceRef.attribute.key
        this.sourceType = this.sourceRef.attribute.type
        this.targetType = this.targetRef.attribute.type


        this.identifier = ShaderLink.getPattern(this)
    }

}