<script>
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import ShadingOption from "./editor/ShadingOption.svelte";
    import ActiveFeatures from "./editor/ActiveFeatures.svelte";
    import AddEntity from "./editor/AddEntity.svelte";
    import GizmoSettings from "./editor/GizmoSettings.svelte";
    import ViewportActions from "../../../libs/ViewportActions";
    import SelectionStore from "../../../stores/SelectionStore";


    export let settings
    export let engine
    export let translate


</script>

<div class="left-content">
    <ActiveFeatures settings={settings}/>
    <Dropdown>
        <button slot="button" data-viewbutton="-">
            {translate("SELECT")}
        </button>

        <button on:click={() => ViewportActions.selectAll()}>
            {translate("ALL")}
        </button>

        <button on:click={() => ViewportActions.invertSelection()}>
            {translate("INVERT")}
        </button>

        <button on:click={() => SelectionStore.engineSelected = []}>
            {translate("NONE")}
        </button>
    </Dropdown>
    <AddEntity/>

</div>
<GizmoSettings settings={settings}/>
<div class="right-content">
    <ShadingOption translate={translate}/>
</div>

<style>

    .left-content {
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: flex-start;
        width: 100%;

    }

    .right-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;

    }

</style>