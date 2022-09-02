<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import {onDestroy, onMount} from "svelte";
    import ConsoleAPI from "../../libs/engine/production/libs/ConsoleAPI";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import EngineStore from "../../stores/EngineStore";
    import {v4} from "uuid";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import InfiniteScroller from "../../../../components/infinite-scroller/InfiniteScroller.svelte";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined
    const internalID = v4()
    let metadata
    let toRender = []
    let showWarnings = true
    let showLogs = true
    let showErrors = true
    let clearOnPlay = false
    let offset = 0
    let maxDepth = 0
    let ref
    let engine
    let changed
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const LINE_HEIGHT = 18
    const TYPES = ConsoleAPI.TYPES

    onMount(() => {
        ConsoleAPI.registerConsole(internalID, (md, messages) => {
            metadata = md
            toRender = messages
            changed = true
        })
    })
    onDestroy(() => {
        ConsoleAPI.unregisterConsole(internalID)
        unsubscribeEngine()
    })

    const translate = key => Localization.PROJECT.CONSOLE[key]

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
</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"terminal"}
>
    <div data-vertdivider="-"></div>
    <button on:click={() => ConsoleAPI.clear()} class="button">
        <Icon>
            clear_all
        </Icon>
        {translate("CLEAR")}
    </button>
    <div data-vertdivider="-"></div>
    <button on:click={() => clearOnPlay = !clearOnPlay} class="button">
        {#if clearOnPlay}
            <Icon>
                check
            </Icon>
        {/if}
        {translate("TOGGLE_CLEAR_ON_PLAY")}
    </button>
    <div class="metadata">
        <Dropdown>
            <button slot="button" style="border: none">
                {translate("VIEW")}
                <ToolTip content={translate("VIEW")}/>
            </button>

            <button on:click={() => showErrors = !showErrors}>
                {#if showErrors}
                    <Icon>
                        check
                    </Icon>
                {/if}
                {translate("ERRORS")}

            </button>
            <button on:click={() => showWarnings = !showWarnings}>
                {#if showWarnings}
                    <Icon>
                        check
                    </Icon>
                {/if}
                {translate("WARNINGS")}
            </button>
            <button on:click={() => showLogs = !showLogs}>
                {#if showLogs}
                    <Icon>
                        check
                    </Icon>
                {/if}
                {translate("LOGS")}
            </button>
        </Dropdown>
    </div>
</Header>

<div class="wrapper" bind:this={ref}>
    <InfiniteScroller
            setMaxDepth={v => maxDepth = v}
            setOffset={v => offset = v}
            branchSize={LINE_HEIGHT}
            data={toRender}
    />
    {#each toRender as _, i}
        {#if i < maxDepth && toRender[i + offset]}
            <div
                    class="container"
                    class:error={toRender[i + offset].type === TYPES.ERROR}
                    class:warn={toRender[i + offset].type === TYPES.WARN}
                    class:log={toRender[i + offset].type === TYPES.LOG}
                    style={i + offset === 0 || (i + offset > 0 && toRender[i + offset - 1].blockID !== toRender[i + offset].blockID) ? "border-bottom: var(--pj-border-secondary) 1px solid;" : undefined}
            >
                {#if !toRender[i + offset].notFirstOnBlock}
                    {#if toRender[i + offset].type === TYPES.ERROR}
                        <Icon>
                            error
                        </Icon>
                    {:else if toRender[i + offset].type === TYPES.WARN}
                        <Icon>
                            warning
                        </Icon>
                    {/if}
                {/if}
                <pre>{toRender[i + offset].message}</pre>
                <div style="text-align: right; width: 100%">
                {#if !toRender[i + offset].notFirstOnBlock}
                    {toRender[i].src}
                {/if}
                </div>
            </div>
        {/if}
    {/each}

</div>

<style>
    .container {
        line-height: 18px;
        height: 18px;
        display: flex;
        gap: 4px;
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
        color: #686d71;

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

</style>