<script>
    import {onMount} from "svelte";
    import "./css/alert.css"

    let target
    const close = (newElement) => {
        newElement.className = "outAnimation alert-modal"
        newElement.addEventListener("animationend", () => {
            target.removeChild(newElement)
        }, {once: true})
    }
    const pushAlert = (message, type, onClick, delay = 3500) => {
        const newElement = document.createElement("div")
        target.appendChild(newElement)
        target.style.zIndex = "9999"
        let variant
        switch (type) {
            case "success":
                variant = {color: "#00F400", icon: "done"}
                break
            case "alert":
                variant = {color: "#FFFF3E", icon: "warning"}
                break
            case "info":
                variant = {color: "#0095ff", icon: "info"}
                break
            default:
                variant = {color: "#ff5555", icon: "error"}
                break
        }

        setTimeout(() => close(newElement), delay)
        newElement.innerHTML = `
        <div class="alertContainer alert-modal" style="--background: ${variant.color}">
            <div class="content alert-modal">
                <div class="icon alert-modal">
                    <span data-icon="-">${variant.icon}</span>
                </div>
                ${message}
            </div>
            <button class="button alert-modal" data-action="-">
                <span data-icon="-" style="height: 1.1rem; font-size: 1.1rem">close</span>
            </button>
        </div>
      `
        if (onClick)
            newElement.addEventListener("click", onClick, {once: true})

        newElement
            .getElementsByTagName("button")[0]
            .addEventListener(
                "click",
                () => close(newElement),
                {once: true}
            )
    }
    onMount(() => {
        alert.pushAlert = pushAlert
    })
</script>

<div bind:this={target} class="target"></div>
<style>
    .target {
        position: fixed;
        z-index: 9999;
        bottom: 8px;
        left: 8px;

        display: grid;
        align-items: flex-end;
        gap: 8px;
    }
</style>