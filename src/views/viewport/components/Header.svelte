<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
    import Localization from "../../../libs/libs/Localization";
    import getIcon from "../utils/get-icon";

    export let settings

    export let engine
    export let setViewportTab
    export let viewportTab
    let ref
    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>


<Dropdown  asButton={true} disabled={engine.executingAnimation}>
    <button slot="button" class="title" disabled={engine.executingAnimation}>
        <Icon styles="font-size: .9rem">
            {getIcon(viewportTab)}
        </Icon>

    </button>

    <button data-highlight={viewportTab === VIEWPORT_TABS.EDITOR ? "-" : ""}
            on:click={() =>setViewportTab(VIEWPORT_TABS.EDITOR)}>
        <Icon>public</Icon>
        {translate("EDITOR")}
    </button>
    <button on:click={() =>setViewportTab( VIEWPORT_TABS.UI)}
            data-highlight={viewportTab === VIEWPORT_TABS.UI ? "-" : ""}>
        <Icon>widgets</Icon>
        {translate("UI")}
    </button>
    <button on:click={() =>setViewportTab(VIEWPORT_TABS.TERRAIN)}
            data-highlight={viewportTab === VIEWPORT_TABS.TERRAIN ? "-" : ""}>
        <Icon>terrain</Icon>
        {translate("TERRAIN")}
    </button>
    <button on:click={() =>setViewportTab(VIEWPORT_TABS.PREFERENCES)}
            data-highlight={viewportTab === VIEWPORT_TABS.PREFERENCES ? "-" : ""}>
        <Icon>settings</Icon>
        {translate("PREFERENCES")}
    </button>
</Dropdown>
<div data-vertdivider="-" style="height: 15px"></div>


<style>

    .title {
        display: flex;
        align-items: center;
        gap: 2px;

        padding: 0 2px;

        border: none;
    }


</style>