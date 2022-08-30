export default function handleBoardScroll(ref) {

    const handleMouseMove = (event) => {
        ref.scrollTop -= event.movementY
        ref.scrollLeft -= event.movementX
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMouseMove)
    }, {once: true})
}
