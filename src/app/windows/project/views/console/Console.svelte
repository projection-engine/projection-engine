<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import {onDestroy, onMount} from "svelte";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined
    let ref

    onMount(() => {
        console.pushTarget(ref)
    })
    onDestroy(() => {
        console.removeTarget(ref)
    })

    const translate = key => Localization.PROJECT.CONSOLE[key]


</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"terminal"}
>
    <button
            on:click={() => {
            ref.textContent = ""
            ref.lastContent = undefined
            ref.lastLine = undefined
            ref.looped = undefined
        }}
    >
        <Icon>
            clear_all
        </Icon>
        {translate("CLEAR")}
    </button>
</Header>
<div class={"wrapper"}>
    <pre bind:this={ref} class="console"></pre>
</div>

<style>
    .wrapper {
        padding: 4px;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .console {
        font-size: 0.8rem;
        margin: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;
        white-space: pre;
        background: var(--pj-background-tertiary);
        padding: 4px;
        color: var(--pj-color-secondary);
        border-radius: 5px;
        overflow-y: auto;
    }

</style>