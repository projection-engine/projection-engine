import updateLinks from "../utils/update-links";
import resolveLinks from "../utils/resolve-links";

export default function onMutation(links, ref, [record]) { 
     if(record.type === "attributes" && record.attributeName !== "transform")
         return
    updateLinks( resolveLinks(links).map(l => {
        const linkPath = document.getElementById(l.target + "-" + l.source)
        return {
            target: document.getElementById(l.target),
            source: document.getElementById(l.source),
            linkPath
        }
    }), ref)
}