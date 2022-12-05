<script>
    import LevelSelector from "./components/LevelSelector.svelte";
    import ActionHistory from "./components/ActionHistory.svelte";
    import Console from "../Console.svelte";

    export let store
    export let settings
    export let engine


</script>

<div class="level-selector">
    <ActionHistory engine={engine}/>
    <div data-vertdivider="-" style="height: 15px; margin: 0;"></div>
    <Console engine={engine}/>
    <div data-vertdivider="-" style="height: 15px; margin: 0"></div>
    <LevelSelector store={store} engine={engine}/>
</div>

<style>

    .level-selector {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

</style>