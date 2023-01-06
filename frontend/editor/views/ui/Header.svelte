<script>
    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";

    import SelectionStore from "../../stores/SelectionStore";
    import GIZMOS from "../../static/GIZMOS.ts";
    import SettingsStore from "../../stores/SettingsStore";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities";
    import Entity from "../../../../engine-core/instances/Entity";
    import Engine from "../../../../engine-core/Engine";
    import COMPONENTS from "../../../../engine-core/static/COMPONENTS";
    import UIAPI from "../../../../engine-core/lib/rendering/UIAPI";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import Icon from "../../../components/icon/Icon.svelte";
    import ToolTip from "../../../components/tooltip/ToolTip.svelte";


    export let isAlreadyOpen
    export let settings
    export let engine

    function selectAll() {
        const m = [], size = Engine.entities.length
        for (let i = 0; i < size; i++) {
            const e = Engine.entities[i]
            if (e.uiComponent)
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
        const e = new Entity(undefined, "UI-ShaderNode")
        e.addComponent(COMPONENTS.UI)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: e})
    }

    function focusOnView() {
        UIAPI.buildUI(ref)
        update()
        isAlreadyOpen = false
    }
</script>

<ViewHeader>
    {#if isAlreadyOpen && !engine.executingAnimation}
        <button on:click={focusOnView} data-view-header-button="-" style="max-width: unset">
            <Icon styles="font-size: .9rem">place</Icon>
            {LOCALIZATION_EN.FOCUS_ON_THIS_VIEW}
        </button>
    {:else if !isAlreadyOpen}
        <div class="left-content">
            <button on:click={addUiElement} data-view-header-button="-" style="max-width: unset">
                <Icon styles="font-size: .9rem">add</Icon>
                {LOCALIZATION_EN.ADD_ELEMENT}
            </button>
            <button on:click={selectAll} data-view-header-button="-" style="max-width: unset">
                {LOCALIZATION_EN.SELECT_ALL}
            </button>
        </div>

        <div class="right-content">
            <button data-highlight={isOnSelection ? "-" : ""} on:click={toggleSelection} data-view-header-button="-">
                <Icon>
                    highlight_alt
                </Icon>
                <ToolTip content={LOCALIZATION_EN.PICKER}/>
            </button>
        </div>
    {/if}
</ViewHeader>
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
