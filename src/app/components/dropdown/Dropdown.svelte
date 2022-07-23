<script>
    import Icon from "../Icon/Icon.svelte";
    import transformModal from "./utils/transform-modal.js";
    import {onDestroy, onMount} from "svelte";
    import "./css/dropdown.css"
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
        const el = document.elementsFromPoint(event.clientX, event.clientY)
        let bClicked = false, mClicked = false
        el.forEach(element => {
            if (element === button)
                bClicked = true
            if (element === modal)
                mClicked = true
        })
        if (!bClicked && !mClicked) {
            if (onClose && open)
                onClose()
            open = false
            modal.style.zIndex = "-1"
        }
    }

    onMount(() => {
        document.addEventListener("mousedown", handler)
    })
    onDestroy(() => {
        document.removeEventListener("mousedown", handler)
    })
</script>

<div>
    <span
            bind:this={button}
            on:click={() => {
            if(!open){
                if(onOpen)
                    onOpen()
                open = true
              }
        }}
            style={(hideArrow ? "" : "display: flex; align-items: center; gap: 4px; ") + styles}
            disabled="{disabled}"
    >
        {#if !hideArrow}
            <Icon styles={`${!open ? "transform: rotate(-90deg)" : ""}`}>arrow_drop_down</Icon>
        {/if}
        <slot name="button"/>
    </span>
    <div
        class="modal dropdown"
        bind:this={modal}
    >
        <slot/>
    </div>
</div>