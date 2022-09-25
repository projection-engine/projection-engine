<script>
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import ShadingOption from "../shared/ShadingOption.svelte";
    import ActiveFeatures from "./ActiveFeatures.svelte";
    import AddEntity from "./AddEntity.svelte";
    import GizmoSettings from "./GizmoSettings.svelte";
    import ViewportActions from "../../../../libs/ViewportActions";
    import SelectionStore from "../../../../stores/SelectionStore";
    import Localization from "../../../../../shared/libs/Localization";


    export let settings
    export let engine
    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>

<div class="left-content">
    <slot name="switch-button"/>
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
    <ShadingOption />
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