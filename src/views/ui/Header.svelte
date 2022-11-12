<script>
    import Localization from "../../templates/LOCALIZATION_EN";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import GIZMOS from "../../static/GIZMOS";
    import SettingsStore from "../../stores/SettingsStore";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities";
    import Entity from "../../../public/engine/instances/Entity";
    import Engine from "../../../public/engine/Engine";
    import COMPONENTS from "../../../public/engine/static/COMPONENTS";
    import UIAPI from "../../../public/engine/api/UIAPI";

    export let isAlreadyOpen
    export let settings
    export let engine

    function selectAll() {
        const m = [], size = Engine.entities.length
        for (let i = 0; i < size; i++) {
            const e = Engine.entities[i]
            if (e.components.get(COMPONENTS.UI) != null)
                m.push(e.id)
        }
        SelectionStore.engineSelected = m
    }

    $: isOnSelection = settings.gizmo === GIZMOS.NONE

    function toggleSelection() {
        if (isOnSelection)
            SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})
        else
            SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})
    }

    function addUiElement() {
        const e = new Entity(undefined, "UI-Node")
        e.addComponent(COMPONENTS.UI)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: e})
    }

    function focusOnView() {
        UIAPI.buildUI(ref)
        update()
        isAlreadyOpen = false
    }
</script>

{#if isAlreadyOpen && !engine.executingAnimation}
    <button on:click={focusOnView}>
        <Icon styles="font-size: .9rem">place</Icon>
        {Localization.FOCUS_ON_THIS_VIEW}
    </button>
{:else if !isAlreadyOpen}
    <div class="left-content">
        <button on:click={addUiElement}>
            <Icon styles="font-size: .9rem">add</Icon>
            {Localization.ADD_ELEMENT}
        </button>
        <button on:click={selectAll}>
            {Localization.SELECT_ALL}
        </button>
    </div>

    <div class="right-content">
        <button data-highlight={isOnSelection ? "-" : ""} on:click={toggleSelection}>
            <Icon>
                highlight_alt
            </Icon>
            {Localization.PICKER}
        </button>
    </div>
{/if}
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

    button {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 0 4px;
        font-size: 0.7rem !important;

        border: none;
    }
</style>