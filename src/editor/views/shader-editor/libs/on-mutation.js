import updateLinks from "../utils/update-links";

export default function onMutation(resolvedLinks, ref, [record]) {
     if(!ref || !resolvedLinks)
         return
     if(record && record.type === "attributes" && record.attributeName !== "transform")
         return
    updateLinks( resolvedLinks.map(l => {
        const linkPath = document.getElementById(l.target + "-" + l.source)
        return {
            target: document.getElementById(l.target),
            source: document.getElementById(l.source),
            linkPath
        }
    }), ref)
}