const offX = 4, offY = 4
const LEFT_LIMIT = 0

export default function transformModal( modal, button) {

    modal.style.zIndex = "-1"
    modal.style.display = "block"

    const buttonBoundingRect = button.getBoundingClientRect()
    const halfHeight = buttonBoundingRect.height / 2
    modal.style.top = (buttonBoundingRect.top + halfHeight) + "px"
    modal.style.left = (buttonBoundingRect.left) + "px"
    modal.style.transform = `translate(0px, ${halfHeight + offY}px)`

    const modalBoundingRect = modal.getBoundingClientRect()
    const body = document.body.getBoundingClientRect()

    let y = `${halfHeight + offY}px`
    if (modalBoundingRect.y < 0)
        y = "calc(50% + " + ((-modalBoundingRect.y / 2 - offY + halfHeight) / 2) + "px)"
    if ((buttonBoundingRect.y + modalBoundingRect.height + buttonBoundingRect.height) > body.height)
        y = `calc(-100% - ${halfHeight + offY}px)`


    let x = "0px"
    if (modalBoundingRect.x < LEFT_LIMIT)
        x = `calc(50% + ${offX}px)`
    if ((modalBoundingRect.x + modalBoundingRect.width) > body.width)
        x = `calc(-100% + ${buttonBoundingRect.width}px)`

    modal.style.transform = `translate(${x}, ${y})`;
    modal.style.zIndex = "999"
    modal.style.display = "grid"
    if (button.firstElementChild)
        button.firstElementChild.setAttribute("data-highlight", "true")
    return

    if (button.firstElementChild)
        button.firstElementChild.setAttribute("data-highlight", "")
}