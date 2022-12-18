import ShaderLink from "../libs/ShaderLink";
import SEContextController from "../libs/SEContextController";

export default function handleLink(src, target, CONTEXT_ID) {
    const ctx = SEContextController.getContext(CONTEXT_ID)
    let newLinks = [...ctx.getLinks()]
    const existing = newLinks.filter(newLinks => newLinks.targetRef.id === target.id && newLinks.targetRef.attribute.key === target.attribute.key)
    newLinks = newLinks.filter(cc => !existing.find(e => e === cc))

    if (!target.attribute.componentRequired || src.attribute.components.includes(target.attribute.componentRequired))
        newLinks.push(new ShaderLink(target, src, CONTEXT_ID))

    ctx.updateLinks(newLinks)
}