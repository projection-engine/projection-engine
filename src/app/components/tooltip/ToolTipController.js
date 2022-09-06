import {onDestroy, onMount} from "svelte";

export default class ToolTipController{
    static targets = new Map()
    static #initialized = false
    static #element
    static initialize(){
        const el = document.createElement("div")
        el.setAttribute("data-tooltip", "-")

        const handleMouseMove = (event) => {
            if (!el)
                return
            el.style.left = (event.clientX + 10) + "px"
            el.style.top = (event.clientY + 10) + "px"

            let transform = {x: "0px", y: "0px"}
            if ((event.clientX + 10 + bBox.width) >= bodyBBox.width)
                transform.x = "calc(-100% - 10px)"
            if ((event.clientY + 10 + bBox.height) >= bodyBBox.height)
                transform.y = "calc(-100% - 10px)"
            el.style.transform = `translate(${transform.x}, ${transform.y})`
        }
        const hover = (event) => {
            if (!el)
                return
            open = true
            bBox = el.getBoundingClientRect()
            bodyBBox = document.body.getBoundingClientRect()
            el.style.left = (event.clientX + 10) + "px"
            el.style.top = (event.clientY + 10) + "px"
            document.addEventListener("mousemove", handleMouseMove)
            portal.parentElement.addEventListener(
                "mouseleave",
                () => {
                    document.removeEventListener("mousemove", handleMouseMove)
                    open = false
                },
                {once: true}
            )
        }

        $: open ? portal.open() : portal.close()
        onMount(() => {
            if (!el)
                return
            portal.create(el)
            portal.parentElement.addEventListener("mouseenter", hover)
        })
        onDestroy(() => {
            try {
                portal.parentElement.removeEventListener("mouseenter", hover)
                portal.destroy()
            } catch (err) {
                console.error(err)
            }
        })
        ToolTipController.#element
            


    }
    static removeTarget(id){
        ToolTipController.targets.delete(id)
    }
}