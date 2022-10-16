<script>
    import {onDestroy, onMount} from "svelte";
    import INFORMATION_CONTAINER from "../../../data/INFORMATION_CONTAINER";
    import SettingsStore from "../../../stores/SettingsStore";
    import GIZMOS from "../../../data/GIZMOS";
    import SelectionStore from "../../../stores/SelectionStore";
    import Localization from "../../../libs/Localization";

    let ref
    let isChanging = false
    let settings
    let selectedSize = -1
    const unsubscribeSelection = SelectionStore.getStore(_ => selectedSize = SelectionStore.engineSelected.length)
    const unsubscribe = SettingsStore.getStore(v => settings = v)
    onMount(() => {
        ref.isChanging = () => {
            if (isChanging)
                return
            isChanging = true
        }
        ref.finished = () => isChanging = false
    })
    onDestroy(() => {
        unsubscribe()
        unsubscribeSelection()
    })

    $: isValidPivot = settings.gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    $: isValidScaling = settings.gizmo === GIZMOS.SCALE
</script>


<div class="wrapper">
    {#if isChanging}
        {#if isValidScaling}
            <div class="row">ALT - {Localization.PROJECT.VIEWPORT.ALT_FOR_FIXED}</div>
        {/if}
        {#if isValidPivot}
            <div class="row">ALT - {Localization.PROJECT.VIEWPORT.ALT_FOR_PIVOT}</div>
        {/if}
        <div class="row">CTRL - {Localization.PROJECT.VIEWPORT.CTRL_FOR_UNITARY}</div>
    {/if}
    <div
            id={INFORMATION_CONTAINER.TRANSFORMATION}
            bind:this={ref}
            style={!isChanging ? "display: none" : undefined}
            class="row"
    ></div>
</div>
<style>
    .wrapper {
        position: absolute;
        bottom: 4px;
        left: 4px;

        display: flex;
        align-items: center;
        gap: 4px;
    }

    .row {
        backdrop-filter: blur(10px) brightness(75%);
        padding: 4px;
        border-radius: 3px;
        font-size: .7rem;
        z-index: 999;
        height: 25px;
    }
</style>