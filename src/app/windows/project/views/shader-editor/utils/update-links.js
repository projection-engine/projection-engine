import getBezierCurve from "./get-bezier-curve";
import LINK_WIDTH from "../data/LINK_WIDTH";

export default function updateLinks(mappedLinks) {
    const scale = window.blueprints.scale
    try {
        let parentBBox = ref.getBoundingClientRect()
        const bounding = {
            x: ref.scrollLeft - parentBBox.left,
            y: ref.scrollTop - parentBBox.top
        }

        for (let i = 0; i < mappedLinks.length; i++) {
            const {
                target,
                source,
                linkPath
            } = mappedLinks[i]

            if (target && source && linkPath) {
                const sourceBBox = source.getBoundingClientRect(),
                    targetBBox = target.getBoundingClientRect()
                const OFFSET = 7.5
                const curve = getBezierCurve(
                    {
                        x: (sourceBBox.x + bounding.x + OFFSET) / scale,
                        y: (sourceBBox.y + bounding.y + OFFSET + LINK_WIDTH * 2) / scale
                    },
                    {
                        x1: (targetBBox.x + bounding.x + OFFSET) / scale,
                        y1: (targetBBox.y + bounding.y + OFFSET + LINK_WIDTH * 2) / scale
                    })

                if (linkPath.getAttribute("d") !== curve)
                    linkPath.setAttribute("d", curve)
            }
        }

    } catch (error) {
        console.error(error)
    }
}