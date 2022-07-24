export default function handleBoardScroll(ref) {

    const handleMouseMove = (event) => {
        if(!document.pointerLockElement)
            ref.requestPointerLock()

        ref.scrollTop -= event.movementY
        ref.scrollLeft -= event.movementX
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", () => {
        document.exitPointerLock()
        document.removeEventListener("mousemove", handleMouseMove)
    }, {once: true})
}
