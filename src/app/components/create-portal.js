export default function createPortal(){
    let portal
    return {
        open(ref){
            portal = document.createElement('div')
            portal.style.position = "absolute"
            portal.style.zIndex = "999"
            document.body.appendChild(portal)
            portal.appendChild(ref)
        },
        close() {
            document.body.removeChild(portal)
        }
    }
}