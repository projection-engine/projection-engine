<script>
    import {onMount} from "svelte";
    import ConsoleAPI from "../../../engine-core/lib/utils/ConsoleAPI";

    let target
    const close = (newElement) => {
        newElement.className = "outAnimation alert-modal"
        newElement.addEventListener("animationend", () => {
            if (newElement.parentElement === target)
                target.removeChild(newElement)
        }, {once: true})
    }

    function pushAlert(message, type, onClick, delay = 3500) {
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
        ConsoleAPI.onLog = (messages) => {
            pushAlert(messages.join(" "), "info")
        }
        ConsoleAPI.onWarn = (messages) => {
            pushAlert(messages.join(" "), "alert")
        }
        ConsoleAPI.onError = (messages) => {
            pushAlert(messages.join(" "), "error")
        }

    })
</script>

<div bind:this={target} class="target"></div>
<style>
    .target {
        position: fixed;
        z-index: 9999;
        bottom: 4px;
        left: 50%;

        transform: translateX(-50%);
        display: grid;
        align-items: flex-end;
        justify-items: center;
        gap: 4px;
    }
</style>
