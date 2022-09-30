<script>
    import Icon from "../icon/Icon.svelte";
    import transformModal from "./utils/transform-modal.js";
    import {onDestroy, onMount} from "svelte";
    import "./css/dropdown.css"
    import createPortal from "../create-portal";

    export let asButton
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
    $: {
        if (modal && button && open) {
            const mutation = new MutationObserver(() => {
                Array.from(modal.children).forEach(c => c.closeDropdown = () => close())
                transformModal(modal, button)
            })
            mutation.observe(modal, {childList: true})
        }
    }

    function close() {
        if (onClose && open)
            onClose()
        open = false
        modal.style.display = "none"
        modal.style.zIndex = "-1"
    }

    function handler(event) {
        if (!modal.contains(event.target) && !button.contains(event.target))
            close()
    }

    const portal = createPortal(500, false)
    $: open ? portal.open() : portal.close()
    onMount(() => {
        portal.create(modal)
        modal.closeDropdown = () => close()
    })
    onDestroy(() => {
        portal.destroy()
        document.removeEventListener("click", handler)
    })


    $: {
        if (modal) {
            if (open)
                document.addEventListener("click", handler)
            else
                document.removeEventListener("click", handler)
        }
    }
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
        class={(open && !noBackground ? "highlight dropdown" : "")}
        class:button={asButton}
        class:wrapper={true}
        style={(width ?  `width: ${width};` : "" ) + buttonStyles }
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
        {#if open}
            <slot/>
        {/if}
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .button {
        min-height: 22px;
        max-height: 22px;
        border-radius: 3px;
        background: var(--pj-background-tertiary);
        border: var(--pj-border-primary) 1px solid;
    }

    .button:active {
        color: var(--pj-accent-color);
        background: var(--pj-background-primary);
    }


</style>