import AlertController from "./AlertController"

function close(newElement) {
	const target = AlertController.target
	newElement.className = "outAnimation alert-modal"
	newElement.addEventListener("animationend", () => {
		if (newElement.parentElement === target)
			target.removeChild(newElement)
	}, {once: true})
}


export default function pushAlert(message, type) {
	const target = AlertController.target
	let variant
	switch (type) {
	case "success":
		variant = {color: "#03c403", icon: "done"}
		break
	case "alert":
		variant = {color: "#d97a00", icon: "warning"}
		break
	case "info":
		variant = {color: "#0095ff", icon: "info"}
		break
	default:
		variant = {color: "#ff5555", icon: "error"}
		break
	}

	const newElement = document.createElement("div")

	let i = 0
	while (target.children.length > 4) {
		target.removeChild(target.children[i])
		i++
	}

	target.appendChild(newElement)
	target.style.zIndex = "9999"

	setTimeout(() => close(newElement), AlertController.defaultDelay)
	newElement.innerHTML = `
                <div class="alertContainer alert-modal" style="--background: ${variant.color}">
                    <div class="content alert-modal">
                        <div class="icon alert-modal">
                            <span data-svelteicon="-">${variant.icon}</span>
                        </div>
                        ${message}
                    </div>
                    <button class="button alert-modal" data-svelteaction="-">
                        <span data-svelteicon="-" style="height: 1.1rem; font-size: 1.1rem">close</span>
                    </button>
                </div>
            `

	newElement
		.getElementsByTagName("button")[0]
		.addEventListener(
			"click",
			() => close(newElement),
			{once: true}
		)
}