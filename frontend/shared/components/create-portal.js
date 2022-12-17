export default function createPortal(index, fullSize = true) {
    let portal

    return {
        create(ref, styles) {
            this.parentElement = ref.parentElement
            portal = document.createElement('div')
            portal.style.position = "absolute"
            portal.style.zIndex = "-1"
            if (fullSize) {
                portal.style.width = "100vw"
                portal.style.height = "100vh"
            }
            portal.style.top = "0"
            portal.style.left = "0"
            if (typeof styles === "object")
                Object.assign(portal.style, styles)

            document.body.appendChild(portal)
            portal.appendChild(ref)
        },
        open() {
            if (!portal)
                return
            portal.style.zIndex = index
        },
        close() {
            if (!portal)
                return
            portal.style.zIndex = "-1"
        },
        destroy() {
            if (!portal)
                return
            document.body.removeChild(portal)
        }
    }
}