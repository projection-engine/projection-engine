<script lang="ts">
    import Icon from "../icon/Icon.svelte";
    import "./css/dropdown.css"
    import Dialog from "../dialog/Dialog.svelte";

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
    let button

    function close() {
        onClose?.()
        open = false
    }

    function handler(event: boolean | MouseEvent, modal: HTMLElement): boolean {
        if (!open)
            return false
        if (typeof event === "object") {
            const found = event.composedPath().find((e: HTMLElement) => e.getAttribute?.("data-svelteiscolorpicker"))
            if (!found && !modal.contains(<HTMLElement | undefined>event.target) && !button.contains(event.target))
                close()
        } else
            close()
        return true
    }


</script>

<div
        bind:this={button}
        on:click={() => {
            if(!open && !disabled){
                onOpen?.()
                open = true
            }
        }}
        class={(open && !noBackground ? "highlight dropdown" : "")}
        class:button={asButton}
        class:wrapper={true}
        style={(width ?  `width: ${width};` : "" ) + buttonStyles }
>

    <slot name="button"/>
    {#if !hideArrow && !disabled}
        <Icon styles={`${!open ? "transform: rotate(-90deg)" : ""}`}>arrow_drop_down</Icon>
    {/if}

    <Dialog
            handleClose={handler}
            isOpen={open}
            targetBinding={button}
            styles={styles ? "align-items: center;" + styles : undefined}
    >
        <slot/>
    </Dialog>
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
