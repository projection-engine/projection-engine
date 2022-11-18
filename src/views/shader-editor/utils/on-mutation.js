import updateLinks from "./update-links";
import SEContextController from "../libs/SEContextController";

export default function onMutation(contextID, data = []) {
    const record = data[0]
    const ctx = SEContextController.getContext(contextID)

    if (record && record.type === "attributes" && record.attributeName !== "transform")
        return
    updateLinks(
        ctx.getLinks().map(l => {
            const linkPath = document.getElementById(l.identifier)
            return {
                target: document.getElementById(l.target),
                source: document.getElementById(l.source),
                linkPath
            }
        }),
        document.getElementById(contextID)
    )
}