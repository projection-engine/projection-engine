<script lang="ts">
    import UIAPI from "../../../../../engine/core/lib/rendering/UIAPI"
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore";
    import type EditorEntity from "../../../../../engine/tools/EditorEntity";
    import EntityFactoryService from "../../../services/engine/EntityFactoryService";
    import {Components} from "@engine-core/engine.enum";
    import ResourceEntityMapper from "@engine-core/resource-libs/ResourceEntityMapper";

    export let isOnSelection:boolean
    export let toggleOnSelection:GenericVoidFunction
    export let selected:EditorEntity
    export let isAutoUpdateEnabled:boolean
    export let toggleAutoUpdate:GenericVoidFunction

    function selectAll() {
    	EntitySelectionStore.setEntitiesSelected(ResourceEntityMapper.withComponent(Components.UI).array)
    }

</script>

<ViewHeader>
    <div class="left-content">
        <button data-sveltebuttondefault="-" on:click={EntityFactoryService.createUI} data-svelteview-header-button="-"
                style="max-width: unset">
            <Icon styles="font-size: .9rem">add</Icon>
            {LocalizationEN.ADD_ELEMENT}
        </button>
        <button data-sveltebuttondefault="-" on:click={selectAll} data-svelteview-header-button="-"
                style="max-width: unset">
            {LocalizationEN.SELECT_ALL}
        </button>
        <div data-sveltevertdivider="-"></div>
        <button data-sveltebuttondefault="-"
                on:click={() => {
                    UIAPI.updateAllElements().then(() => {
                        ToastNotificationSystem.getInstance().log(LocalizationEN.UPDATING_UI)
                    })
                }}
                data-svelteview-header-button="-"
                style="max-width: unset">
            <Icon styles="font-size: .9rem">refresh</Icon>
            <ToolTip content={LocalizationEN.FORCE_UPDATE}/>
        </button>
        <button data-sveltebuttondefault="-" on:click={toggleAutoUpdate} data-svelteview-header-button="-"
                style="max-width: unset">
            <Icon styles="font-size: .9rem">
                {#if isAutoUpdateEnabled}
                    update
                {:else}
                    update_disabled
                {/if}
            </Icon>
            {LocalizationEN.AUTO_UPDATE}
        </button>
        {#if selected}
            <div data-sveltevertdivider="-"></div>
            <small class="entity-selected">
                {selected.name}
            </small>
        {/if}
    </div>

    <div class="right-content">
        <button data-sveltebuttondefault="-" data-sveltehighlight={isOnSelection ? "-" : ""}
                on:click={toggleOnSelection} data-svelteview-header-button="-">
            <Icon>
                highlight_alt
            </Icon>
            <ToolTip content={LocalizationEN.PICKER}/>
        </button>
    </div>

</ViewHeader>

<style>
    .entity-selected {
        padding: 4px;
        height: 20px;
        font-size: .7rem;
        color: var(--pj-color-primary);
        border-radius: 3px;
        background: var(--pj-accent-color);
    }

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

    button {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 0 4px;
        font-size: 0.7rem !important;

        border: none;
    }
</style>
