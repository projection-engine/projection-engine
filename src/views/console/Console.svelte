<script>
    import Localization from "../../templates/LOCALIZATION_EN";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import {onDestroy, onMount} from "svelte";
    import ConsoleAPI from "../../../public/engine/lib/utils/ConsoleAPI";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import EngineStore from "../../stores/EngineStore";
    import {v4} from "uuid";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import createPortal from "shared-resources/frontend/components/create-portal";


    export let switchView = undefined
    export let orientation = undefined
    const internalID = v4()
    let metadata
    let toRender = []
    let showWarnings = true
    let showLogs = true
    let showErrors = true
    let clearOnPlay = false

    let ref
    let engine
    let changed
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const TYPES = ConsoleAPI.TYPES
    let modal
    let objectOpen

    function handler(event) {
        if (!modal.firstChild.contains(event.target))
            objectOpen = undefined
    }

    onMount(() => {
        ConsoleAPI.registerConsole(internalID, (md, messages) => {
            metadata = md
            toRender = messages
            changed = true
        })
        portal.create(modal, {backdropFilter: "blur(2px)"})
        document.addEventListener("mousedown", handler)
    })
    onDestroy(() => {
        ConsoleAPI.unregisterConsole(internalID)
        unsubscribeEngine()

        portal.destroy()
        document.removeEventListener("mousedown", handler)
    })

    $: if (engine.executingAnimation && clearOnPlay) ConsoleAPI.clear()
    $: {
        if (changed) {
            changed = false
            const newToRender = []
            for (let i = 0; i < toRender.length; i++) {
                if (!showLogs && toRender[i].type === ConsoleAPI.TYPES.LOG)
                    continue
                if (!showWarnings && toRender[i].type === ConsoleAPI.TYPES.WARN)
                    continue
                if (!showErrors && toRender[i].type === ConsoleAPI.TYPES.ERROR)
                    continue
                newToRender.push(toRender[i])
            }
            toRender = newToRender
        }
    }

    const portal = createPortal(999)
    $: objectOpen != null ? portal.open() : portal.close()

</script>
<ViewHeader>

    <button on:click={() => ConsoleAPI.clear()} class="button">
        <Icon>
            clear_all
        </Icon>
        {Localization.CLEAR}
    </button>
    <div data-vertdivider="-"></div>
    <button on:click={() => clearOnPlay = !clearOnPlay} class="button">
        {#if clearOnPlay}
            <Icon>
                check
            </Icon>
        {/if}
        {Localization.TOGGLE_CLEAR_ON_PLAY}
    </button>
    <div class="metadata">
        <Dropdown>
            <button slot="button" style="border: none">
                {Localization.VIEW}
                <ToolTip content={Localization.VIEW}/>
            </button>

            <button on:click={() => showErrors = !showErrors}>
                {#if showErrors}
                    <Icon>
                        check
                    </Icon>
                {/if}
                {Localization.ERRORS}

            </button>
            <button on:click={() => showWarnings = !showWarnings}>
                {#if showWarnings}
                    <Icon>
                        check
                    </Icon>
                {/if}
                {Localization.WARNINGS}
            </button>
            <button on:click={() => showLogs = !showLogs}>
                {#if showLogs}
                    <Icon>
                        check
                    </Icon>
                {/if}
                {Localization.LOGS}
            </button>
        </Dropdown>
    </div>

</ViewHeader>

<div class="wrapper" bind:this={ref}>
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
            {/if}
            {#if item.object}
                <ToolTip content={Localization.CLICK_TO_SHOW_OBJECT}/>
            {/if}
            <pre data-overflow="-">{item.message}</pre>
            <div style="margin-right: auto; text-align: right; color: var(--pj-color-primary)">{item.src}</div>
        </div>
    </VirtualList>
</div>
<div bind:this={modal} class="container-modal">
    <pre data-pre="-" style="overflow: visible; height: fit-content; line-height: .9rem">{objectOpen}</pre>
</div>

<style>
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

    .metadata {

        width: 100%;
        display: flex;
        justify-content: flex-end;
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

    .button[data-metadata="-"] {
        background: var(--pj-border-primary);
    }


    .wrapper {
        position: relative;
        font-size: .7rem;

        width: 100%;
        height: 100%;
        overflow: hidden;
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