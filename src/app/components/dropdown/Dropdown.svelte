<script>
    import Icon from "../icon/Icon.svelte";
    import transformModal from "./utils/transform-modal.js";
    import {onDestroy, onMount} from "svelte";
    import "./css/dropdown.css"
    import createPortal from "../create-portal";

    export let noBackground = undefined
    export let width = undefined
    export let styles = undefined
    export let disabled = undefined
    export let hideArrow = undefined
    export let onOpen = undefined
    export let onClose = undefined
    export let buttonStyles = ""
    let open = false
    let modal
    let button
    $: if (modal && button) transformModal(open, modal, button)

    function close() {
        if (onClose && open)
            onClose()
        open = false
        modal.style.display = "none"
        modal.style.zIndex = "-1"
    }

    function handler(event) {
        if (!modal.contains(event.target))
            close()
    }

    const portal = createPortal(500, false)
    $: open ? portal.open() : portal.close()
    onMount(() => {
        portal.create(modal)
        modal.closeDropdown = () => close()
        document.addEventListener("mousedown", handler)
    })
    onDestroy(() => {
        portal.destroy()
        document.removeEventListener("mousedown", handler)
    })
</script>

<div
        bind:this={button}
        on:click={() => {
            if(!open && !disabled){
                if(onOpen)
                    onOpen()
                open = true
            }
        }}
        class={open && !noBackground ? "highlight dropdown" : undefined}
        style={((hideArrow ? "height: fit-content; max-width: 100%;" : "display: flex; align-items: center; max-width: 100%;")) + buttonStyles + " width: " + width}
>

    <slot name="button"/>
    {#if !hideArrow}
        <Icon styles={`${!open ? "transform: rotate(-90deg)" : ""}`}>arrow_drop_down</Icon>
    {/if}
    <div
            style={styles}
            class="modal dropdown"
            bind:this={modal}

    >
        <slot/>
    </div>
</div>
