<script>
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";
    import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
    import Localization from "../../../../shared/libs/Localization";

    export let settings

    export let engine
    export let setViewportTab
    export let viewportTab
    let ref
    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>



    <Dropdown hideArrow={true} asButton={true}>
        <button slot="button" class="title">
            <Icon styles="font-size: .9rem">
                {#if viewportTab === VIEWPORT_TABS.EDITOR}
                    public
                {:else}
                    widgets
                {/if}
            </Icon>
            <small data-overflow="-">
                {#if viewportTab === VIEWPORT_TABS.EDITOR}
                    {translate("EDITOR")}
                {:else}
                    {translate("UI")}
                {/if}
            </small>
        </button>

        <button on:click={() =>setViewportTab(VIEWPORT_TABS.EDITOR)}>
            {#if viewportTab === VIEWPORT_TABS.EDITOR}
                <Icon>check</Icon>
            {/if}
            {translate("EDITOR")}
        </button>
        <button on:click={() =>setViewportTab( VIEWPORT_TABS.UI)}>
            {#if viewportTab === VIEWPORT_TABS.UI}
                <Icon>check</Icon>
            {/if}
            {translate("UI")}
        </button>
    </Dropdown>
    <div data-vertdivider="-" style="height: 15px"></div>


<style>
    small {
        font-size: .7rem;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 2px;

        padding: 0 2px;

        border: none;
    }


</style>