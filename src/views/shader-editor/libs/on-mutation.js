import updateLinks from "../utils/update-links";
import SEContextController from "../SEContextController";

export default function onMutation(contextID, data = []) {
    const record = data[0]
    const ctx = SEContextController.getContext(contextID)

    if (record && record.type === "attributes" && record.attributeName !== "transform")
        return
    updateLinks(
        ctx.resolvedLinks.map(l => {
            const linkPath = document.getElementById(l.target + "-" + l.source)
            return {
                target: document.getElementById(l.target),
                source: document.getElementById(l.source),
                linkPath
            }
        }),
        document.getElementById(contextID)
    )
}