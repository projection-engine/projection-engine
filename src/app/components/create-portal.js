export default function createPortal(){
    let portal
    return {
        open(ref, index=999){
            portal = document.createElement('div')
            portal.style.position = "absolute"
            portal.style.zIndex = `${index}`
            document.body.appendChild(portal)
            portal.appendChild(ref)
        },
        close() {
            document.body.removeChild(portal)
        }
    }
}