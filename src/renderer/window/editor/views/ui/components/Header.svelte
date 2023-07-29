<script lang="ts">
    import Engine from "../../../../../engine/core/Engine"
    import COMPONENTS from "../../../../../engine/core/static/COMPONENTS"
    import UIAPI from "../../../../../engine/core/lib/rendering/UIAPI"
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import EngineStateService from "../../../services/engine/EngineStateService"
    import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"
    import EntityAPI from "../../../../../engine/core/lib/utils/EntityAPI"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore";
    import type Entity from "../../../../../engine/core/instances/Entity";

    export let isOnSelection:boolean
    export let toggleOnSelection:GenericVoidFunction
    export let selected:Entity
    export let isAutoUpdateEnabled:boolean
    export let toggleAutoUpdate:GenericVoidFunction

    function selectAll() {
    	const m = [], size = Engine.entities.array.length
    	for (let i = 0; i < size; i++) {
    		const e = Engine.entities.array[i]
    		if (e.uiComponent)
    			m.push(e.id)
    	}
    	EntitySelectionStore.setEntitiesSelected(m)
    }

    function addUI() {
    	const e = EntityAPI.getNewEntityInstance()
    	e.name = "UI-ShaderNode"
    	e.addComponent(COMPONENTS.UI)
    	EngineStateService.add(e)
    }
</script>

<ViewHeader>
    <div class="left-content">
        <button data-sveltebuttondefault="-" on:click={addUI} data-svelteview-header-button="-"
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
