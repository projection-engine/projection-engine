<script>
    import Icon from "../Icon/Icon.svelte";
    import transformModal from "./utils/transform-modal.js";
    import {onDestroy, onMount} from "svelte";
    import "./css/dropdown.css"
    import createPortal from "../create-portal";

    export let styles = ""
    export let disabled = false
    export let hideArrow = false
    export let onOpen = () => null
    export let onClose = () => null
    let open = false
    let modal
    let button
    $: modal && button ? transformModal(open, modal, button) : null


    function handler(event) {
        if (!modal.contains(event.target) || event.target.getAttribute("data-closedropdown") === "-") {
            if (onClose && open)
                onClose()
            open = false
            modal.style.display = "none"
            modal.style.zIndex = "-1"
        }
    }

    const portal = createPortal()
    onMount(() => {
        portal.open(modal, 500)
        document.addEventListener("mousedown", handler)
    })
    onDestroy(() => {
        portal.close()
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
        class={open ? "highlight dropdown" : undefined}
        style={(hideArrow ? "height: fit-content;" : "display: flex; align-items: center; width: 100%;")}
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
