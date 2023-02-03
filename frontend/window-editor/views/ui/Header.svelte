<script>
    import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";

    import SelectionStore from "../../../shared/stores/SelectionStore";

    import Entity from "../../../../engine-core/instances/Entity";
    import Engine from "../../../../engine-core/Engine";
    import COMPONENTS from "../../../../engine-core/static/COMPONENTS";
    import UIAPI from "../../../../engine-core/lib/rendering/UIAPI";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import EntityManager from "../../lib/EntityManager";
    import AlertController from "../../../shared/components/alert/AlertController";


    export let settings
    export let engine
    export let isOnSelection
    export let toggleOnSelection
    export let selected
    export let updateEnabled
    export let toggleAutoUpdate

    function selectAll() {
        const m = [], size = Engine.entities.array.length
        for (let i = 0; i < size; i++) {
            const e = Engine.entities.array[i]
            if (e.uiComponent)
                m.push(e.id)
        }
        SelectionStore.engineSelected = m
    }


    function addUiElement() {
        const e = new Entity(undefined, "UI-ShaderNode")
        e.addComponent(COMPONENTS.UI)
        EntityManager.add(e)
    }


</script>

<ViewHeader>
    <div class="left-content">
        <button data-sveltebuttondefault="-"  on:click={addUiElement} data-svelteview-header-button="-" style="max-width: unset">
            <Icon styles="font-size: .9rem">add</Icon>
            {LOCALIZATION_EN.ADD_ELEMENT}
        </button>
        <button data-sveltebuttondefault="-"  on:click={selectAll} data-svelteview-header-button="-" style="max-width: unset">
            {LOCALIZATION_EN.SELECT_ALL}
        </button>
        <div data-sveltevertdivider="-"></div>
        <button data-sveltebuttondefault="-"
                on:click={() => {
                    UIAPI.updateAllElements().then(() => {
                        AlertController.success(LOCALIZATION_EN.UPDATING_UI)
                    })
                }}
                data-svelteview-header-button="-"
                style="max-width: unset">
            <Icon styles="font-size: .9rem">refresh</Icon>
            <ToolTip content={LOCALIZATION_EN.FORCE_UPDATE}/>
        </button>
        <button data-sveltebuttondefault="-"  on:click={toggleAutoUpdate} data-svelteview-header-button="-" style="max-width: unset">
            <Icon styles="font-size: .9rem">
                {#if updateEnabled}
                    update
                {:else}
                    update_disabled
                {/if}
            </Icon>
            {LOCALIZATION_EN.AUTO_UPDATE}
        </button>
        {#if selected}
            <div data-sveltevertdivider="-"></div>
            <small class="entity-selected">
                {selected.name}
            </small>
        {/if}
    </div>

    <div class="right-content">
        <button data-sveltebuttondefault="-"  data-sveltehighlight={isOnSelection ? "-" : ""} on:click={toggleOnSelection} data-svelteview-header-button="-">
            <Icon>
                highlight_alt
            </Icon>
            <ToolTip content={LOCALIZATION_EN.PICKER}/>
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
