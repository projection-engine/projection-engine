export default function dragNode(event, target, parent){
    const nodeBbox = target.getBoundingClientRect(),
        parentBBox = parent.getBoundingClientRect(),
        bounding = {
            x: parent.scrollLeft - parentBBox.left + nodeBbox.x - event.clientX,
            y: parent.scrollTop - parentBBox.top + nodeBbox.y - event.clientY
        },
        current = {}
    const handleMouseMove = (ev) => {
        current.x = Math.round(((ev.clientX + bounding.x)/  window.blueprints.scale )/ window.blueprints.grid) * window.blueprints.grid
        current.y = Math.round(((ev.clientY + bounding.y) /  window.blueprints.scale) / window.blueprints.grid) * window.blueprints.grid
        target?.setAttribute("transform", `translate(${current.x} ${current.y})`)
    }

    const handleMouseUp = () => {
        if (current.x !== undefined) {
            const bBox = target.getBoundingClientRect()
            if ((bBox.top - parentBBox.top) < 0)
                current.y = 0
            if ((bBox.left - parentBBox.left) < 0)
                current.x = 0
            if ((bBox.top - parentBBox.top) > parentBBox.height)
                current.y = parentBBox.height - bBox.height
            if ((bBox.left - parentBBox.left) > parentBBox.width)
                current.x = parentBBox.width - bBox.width
            target?.setAttribute("transform", `translate(${current.x} ${current.y})`)
        }
        document.removeEventListener("mousemove", handleMouseMove)
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp, {once: true})
}