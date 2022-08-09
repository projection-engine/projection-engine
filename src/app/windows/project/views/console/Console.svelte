<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import {onDestroy, onMount} from "svelte";
    import Debug from "../../libs/engine/libs/debugger/Debug";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import DataStoreController from "../../stores/DataStoreController";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined
    let ref
    let metadata
    let toRender = []
    let showWarnings = true
    let showLogs = true
    let showErrors = true
    let clearOnPlay = false


    let engine
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    onMount(() => {
        Debug.registerConsole(ref, (md, messages) => {
            metadata=md
            toRender = messages
        })
    })
    onDestroy(() => {
        unsubscribeEngine()
        Debug.unregisterConsole(ref)
    })

    const translate = key => Localization.PROJECT.CONSOLE[key]

    $: if (engine.executingAnimation && clearOnPlay) Debug.clear()

</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"terminal"}
>
    <div data-vertdivider="-"></div>
    <button on:click={() => Debug.clear()} class="button">
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
        <button style="--pj-accent-color: #ff5555" data-highlight={showErrors ? "-" : ""} class="button" data-metadata="-" on:click={() => showErrors = !showErrors}>
            <Icon>
                error
            </Icon>
            <ToolTip content={translate("TOGGLE_ERRORS")}/>
        </button>
        <button style="--pj-accent-color: #d99300" data-highlight={showWarnings ? "-" : ""} class="button" data-metadata="-" on:click={() => showWarnings = !showWarnings}>
            <Icon>
                warning
            </Icon>
            <ToolTip content={translate("TOGGLE_WARNINGS")}/>
        </button>
        <button data-highlight={showLogs ? "-" : ""} class="button" data-metadata="-" on:click={() => showLogs = !showLogs}>
            <Icon>
                info
            </Icon>
            <ToolTip content={translate("TOGGLE_LOGS")}/>
        </button>
    </div>
</Header>

<div class={"wrapper"}>
    {#each toRender as message}
        {#if showLogs && message.type === Debug.TYPES.LOG}
            <div class="log">
                {message.message}
            </div>
        {:else if showWarnings && message.type === Debug.TYPES.WARN}
            <div class="warn">
                {message.message}
            </div>
        {:else if showErrors && message.type === Debug.TYPES.ERROR}
            <div class="error">
                {message.message}
            </div>
        {/if}
    {/each}
</div>

<style>
    .error{
        border-bottom: var(--pj-border-primary) 1px solid;
        width: 100%;
        min-height: 30px;
        background: rgba(255, 0, 0, .5);
    }
    .warn{
        border-bottom: var(--pj-border-primary) 1px solid;
        width: 100%;
        min-height: 30px;
        background: rgba(255, 255, 0, .5);
    }
    .log{
        border-bottom: var(--pj-border-primary) 1px solid;
        width: 100%;
        min-height: 30px;
    }
    .button{
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

    .metadata{

        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 2px;

    }
    .wrapper {
        padding: 4px;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

</style>