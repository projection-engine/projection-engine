import STYLES from "./STYLES"

export default class DragDropController {
	static dropTarget?:HTMLElement
	static dragData
	static onDragTarget?:HTMLElement
	static dataTransfer?:any
	static #initialized = false
	static alertModal?:HTMLElement
	static changedElements:HTMLElement[] = []
	static dragImageElement?:HTMLElement

	static onLeave() {
		if (!DragDropController.dropTarget)
			return

		DragDropController.alertModal.innerHTML = ""
		DragDropController.alertModal.style.zIndex = "-1"
		DragDropController.dropTarget.style.opacity = "1"
		DragDropController.dropTarget = undefined

		for(let i = 0; i < DragDropController.changedElements.length; i++){
			const c = DragDropController.changedElements[i]
			if(c){
				c.style.opacity = "1"
			}
		}
	}

	static createElement(html?:string):HTMLElement {
		const element = document.createElement("div")
		element.innerHTML = html
		Object.assign(element.style, STYLES)
		return element
	}

	static initialize() {
		if (DragDropController.#initialized)
			return
		DragDropController.alertModal = DragDropController.createElement("")
		DragDropController.alertModal.style.background = "var(--pj-accent-color)"
		DragDropController.alertModal.style.left = "50%"
		DragDropController.alertModal.style.transform = "translateX(-50%)"
		DragDropController.alertModal.style.top = "4px"
		DragDropController.alertModal.style.zIndex = "-1"
		document.body.appendChild(DragDropController.alertModal)


		DragDropController.#initialized = true


	}
}