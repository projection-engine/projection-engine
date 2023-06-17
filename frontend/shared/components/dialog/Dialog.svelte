<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import SveltePortal from "../../lib/SveltePortal";
    import transformModal from "./transform-modal";

    export let isOpen = false
    export let targetBinding:HTMLElement
    export let handleClose:Function
    export let styles:string

    const portal = new SveltePortal(500, false)
    let modalRef:HTMLElement
    let mutation

    $: {
        if (modalRef && targetBinding && isOpen)
            transformModal(modalRef, targetBinding)
    }

    $: isOpen ? portal.open() : portal.close()

    function closeModal(e:boolean|MouseEvent){
        if(!isOpen)
            return
        const result = handleClose(e, modalRef)
        if (modalRef != null && result) {
            modalRef.style.display = "none"
            modalRef.style.zIndex = "-1"
        }
    }

    onMount(() => {
        mutation = new MutationObserver(() => {
            Array.from(modalRef.children).forEach(c => (c as MutableObject).closeDropdown = () => closeModal(true))
            transformModal(modalRef, targetBinding)
        })
        mutation.observe(modalRef, {childList: true})
        portal.create(modalRef);
        (modalRef as MutableObject).closeDropdown = () => closeModal(true)
        document.addEventListener("mousedown", closeModal)
    })
    onDestroy(() => {
        if(mutation)
            mutation.disconnect()
        portal.destroy()
        document.removeEventListener("mousedown", closeModal)
    })
</script>

<div style={styles} bind:this={modalRef} class="modal dropdown">
    {#if isOpen}
        <slot></slot>
    {/if}
</div>