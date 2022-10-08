<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
    import Localization from "../../../../shared/libs/Localization";

    export let settings

    export let engine
    export let setViewportTab
    export let viewportTab
    let ref
    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>


<Dropdown  asButton={true}>
    <button slot="button" class="title">
        <Icon styles="font-size: .9rem">
            {#if viewportTab === VIEWPORT_TABS.EDITOR}
                public
            {:else if viewportTab === VIEWPORT_TABS.UI}
                widgets
            {:else}
                terrain
            {/if}
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