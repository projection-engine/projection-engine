<script>

    import {onDestroy, onMount} from "svelte"
    import ConsoleAPI from "../../../../../engine-core/lib/utils/ConsoleAPI"

    import VirtualList from "@sveltejs/svelte-virtual-list"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import SveltePortal from "../../../../shared/lib/SveltePortal"
    import LocalizationEN from "../../../../../shared/LocalizationEN"
    import EmptyIcon from "../../../../shared/components/icon/EmptyIcon.svelte"
    import EngineStore from "../../../../stores/EngineStore"

    const COMPONENT_ID = crypto.randomUUID()
    const TYPES = ConsoleAPI.TYPES
    const portal = new SveltePortal(999)

    let toRender = []
    let newMessages = false
    let modal
    let objectOpen

    function handler(event) {
    	if (!modal.firstChild.contains(event.target))
    		objectOpen = undefined
    }

    onMount(() => {
    	EngineStore.getInstance().addListener(COMPONENT_ID, () => ConsoleAPI.clear(), ["executingAnimation"])
    	ConsoleAPI.registerConsole(COMPONENT_ID, (md, messages) => {
    		toRender = messages
    		newMessages = messages.length > 0
    	})
    	portal.create(modal, {background: "rgba(0,0,0,.2)"})
    	document.addEventListener("mousedown", handler)
    })

    onDestroy(() => {
    	EngineStore.getInstance().removeListener(COMPONENT_ID)
    	ConsoleAPI.unregisterConsole(COMPONENT_ID)
    	portal.destroy()
    	document.removeEventListener("mousedown", handler)
    })

    $: objectOpen != null ? portal.open() : portal.close()
</script>

<Dropdown styles="width: clamp(250px, 20vw, 1000px" onOpen={_ => newMessages = false}>
    <button data-sveltebuttondefault="-" slot="button" class="button frame"
            style="background: transparent; max-width: unset;">
        <Icon styles="font-size: 1rem">terminal</Icon>
        <small>{LocalizationEN.CONSOLE}</small>
        {#if newMessages}
            <small class="dot"></small>
        {/if}
    </button>
    <div class="dropdown-container frame">
        <div class="dropdown-header frame">
            <strong>{LocalizationEN.CONSOLE}</strong>
            <button data-sveltebuttondefault="-"
                    class="button frame button-small frame"
                    style="max-width: 22px;gap: 4px"
                    on:click={() => ConsoleAPI.clear()}>
                <Icon>clear_all</Icon>
                {LocalizationEN.CLEAR}
                <ToolTip content={LocalizationEN.CLEAR}/>
            </button>
        </div>
        {#if toRender.length === 0}
            <div style="height: 100%; width: 100%; position: relative">
                <div data-svelteempty="-">
                    <Icon styles="font-size: 75px">terminal</Icon>
                    {LocalizationEN.CONSOLE}
                </div>
            </div>
        {:else}
            <VirtualList items={toRender} let:item>
                <div
                        class="container"
                        class:error={item.type === TYPES.ERROR}
                        class:warn={item.type === TYPES.WARN}
                        class:log={item.type === TYPES.LOG}
                        on:click={() => {
                            if(item.object)
                                objectOpen =item.object
                        }}
                >

                    {#if item.type === TYPES.ERROR}
                        <Icon>
                            error
                        </Icon>
                    {:else if item.type === TYPES.WARN}
                        <Icon>
                            warning
                        </Icon>
                    {:else}
                        <EmptyIcon/>
                    {/if}
                    {#if item.object}
                        <ToolTip content={LocalizationEN.CLICK_TO_SHOW_OBJECT}/>
                    {/if}
                    <small data-svelteoverflow="-">{item.message}</small>
                    <ToolTip content={item.src.includes("file://") ? LocalizationEN.INTERNAL_ERROR : item.str}/>
                </div>
            </VirtualList>
        {/if}
    </div>
</Dropdown>
<div bind:this={modal} class="container-modal">
    <pre data-sveltepre="-" style="overflow: visible; height: fit-content; line-height: .9rem">{objectOpen}</pre>
</div>

<style>
    .dot {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: red;
        top: 4px;
        right: 4px;
        z-index: 100;
    }

    pre {
        width: 100%;
    }

    .container {
        line-height: 18px;
        height: 18px;
        display: flex;
        gap: 4px;
        border-bottom: var(--pj-border-primary) 1px solid;
    }

    pre {
        line-height: 18px;
        height: 18px;
        margin: 0;

    }


    .error {
        padding: 0 4px;
        width: 100%;
        background: rgba(92, 0, 0, .5);
        color: #f77b7b;
    }

    .warn {
        padding: 0 4px;
        width: 100%;
        background: rgba(90, 75, 0, .5);
        color: #d69720;
    }

    .log {
        padding: 0 4px;
        width: 100%;
        color: var(--pj-color-quinary);

    }

    .button {
        height: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border: none;
        white-space: nowrap;
    }

    .button[data-sveltemetadata="-"] {
        background: var(--pj-border-primary);
    }

    .container-modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: 50vw;
        height: fit-content;
        max-height: 75vh;
        overflow-y: auto;

        background-color: var(--pj-background-secondary);
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px;
        box-shadow: var(--pj-boxshadow);
        color: var(--pj-color-secondary);
    }

</style>