
export default class SveltePortal {
	portal?: HTMLElement
	fullSize = true
	index = 999
	parentElement?: HTMLElement

	constructor(index: number, fullSize?: boolean) {
		if (fullSize !== undefined)
			this.fullSize = fullSize
		this.index = index
	}

	create(ref: HTMLElement, styles?: MutableObject) {
		this.parentElement = ref.parentElement
		this.portal = document.createElement("div")
		this.portal.style.position = "absolute"
		this.portal.style.zIndex = "-1"
		if (this.fullSize) {
			this.portal.style.width = "100vw"
			this.portal.style.height = "100vh"
		}
		this.portal.style.top = "0"
		this.portal.style.left = "0"
		if (typeof styles === "object")
			Object.assign(this.portal.style, styles)

		document.body.appendChild(this.portal)
		this.portal.appendChild(ref)
	}

	open() {
		if (!this.portal)
			return
		this.portal.style.zIndex = `${this.index}`
	}

	close() {
		if (!this.portal)
			return
		this.portal.style.zIndex = "-1"
	}

	destroy() {
		if (!this.portal)
			return
		document.body.removeChild(this.portal)
	}

}