import STYLES from "./STYLES"
import AbstractSingleton from "../../../../shared/AbstractSingleton";

export default class DragDropService extends AbstractSingleton{
	dropTarget?:HTMLElement
	dragData
	onDragTarget?:HTMLElement
	dataTransfer?:any
	alertModal?:HTMLElement
	changedElements:HTMLElement[] = []
	dragImageElement?:HTMLElement

	constructor() {
		super();
		this.alertModal = this.createElement("")
		this.alertModal.style.background = "var(--pj-accent-color)"
		this.alertModal.style.left = "50%"
		this.alertModal.style.transform = "translateX(-50%)"
		this.alertModal.style.top = "4px"
		this.alertModal.style.zIndex = "-1"
		document.body.appendChild(this.alertModal)
	}

	static getInstance(): DragDropService{
		return super.get<DragDropService>()
	}

	onLeave() {
		if (!this.dropTarget)
			return

		this.alertModal.innerHTML = ""
		this.alertModal.style.zIndex = "-1"
		this.dropTarget.style.opacity = "1"
		this.dropTarget = undefined

		for(let i = 0; i < this.changedElements.length; i++){
			const c = this.changedElements[i]
			if(c){
				c.style.opacity = "1"
			}
		}
	}

	createElement(html?:string):HTMLElement {
		const element = document.createElement("div")
		element.innerHTML = html
		Object.assign(element.style, STYLES)
		return element
	}

}