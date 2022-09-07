<script>
    import TRANSFORMATION_TYPE from "../../../../../data/TRANSFORMATION_TYPE"
    import GIZMOS from "../../../../../data/GIZMOS"
    import ToolTip from "../../../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../../../components/icon/Icon.svelte";
    import SettingsStore from "../../../../../stores/SettingsStore";
    import GizmoSystem from "../../../../../libs/engine/editor/services/GizmoSystem";
    import Localization from "../../../../../../../libs/Localization";
    import Dropdown from "../../../../../../../components/dropdown/Dropdown.svelte";
    import Range from "../../../../../../../components/range/Range.svelte";

    export let settings
    let initialized = false
    const translate = key => Localization.PROJECT.VIEWPORT[key]
    const updateGizmoGrid = (key, value, submit) => {
        GizmoSystem[key].gridSize = value
        if (submit)
            SettingsStore.updateStore({...settings, gizmoGrid: {...settings.gizmoGrid, [key]: value}})
    }
</script>

<div class="wrapper">
    <Dropdown asButton={true}>
        <button slot="button" class="dropdown">
            {#if settings.transformationType === TRANSFORMATION_TYPE.RELATIVE}
                <Icon styles="font-size: .9rem">
                    place
                </Icon>
                {translate("LOCAL")}
            {:else}
                <Icon styles="font-size: .9rem">
                    language
                </Icon>
                {translate("GLOBAL")}

            {/if}
            <ToolTip content={translate("TRANSFORMATION_ORIENTATION")}/>

        </button>

        <button data-highlight={settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? "" : "-"}
                on:click={() => settings.transformationType = TRANSFORMATION_TYPE.GLOBAL}>
            <Icon>language</Icon>
            {translate("GLOBAL")}
        </button>
        <button data-highlight={settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? "-" : ""}
                on:click={() => settings.transformationType = TRANSFORMATION_TYPE.RELATIVE}>
            <Icon>place</Icon>
            {translate("LOCAL")}
        </button>
    </Dropdown>
    <Dropdown asButton={true}>
        <button slot="button" class="dropdown">
            <Icon styles="font-size: .9rem">straighten</Icon>
            <ToolTip content={translate("MOVEMENT_GRID")}/>
        </button>
        <fieldset class="dropdown-content">
            <legend>{translate("MOVEMENT_GRID")}</legend>
            <Range
                    variant="embedded"
                    label={translate("TRANSLATION_GRID")}
                    precision="3"
                    maxValue={10}
                    minValue={0.001}
                    onFinish={v => updateGizmoGrid("translationGizmo", v, true)}
                    value={settings.gizmoGrid.translationGizmo}
                    handleChange={v => updateGizmoGrid("translationGizmo", v)}
                    isAngle={false}
            />
            <Range
                    variant="embedded"
                    label={translate("SCALE_GRID")}
                    precision="3"
                    maxValue={10}
                    minValue={0.001}
                    onFinish={v => updateGizmoGrid("scaleGizmo", v, true)}
                    value={settings.gizmoGrid.scaleGizmo}
                    handleChange={v => updateGizmoGrid("scaleGizmo", v)}
                    isAngle={false}
            />
            <Range
                    variant="embedded"
                    precision="3"
                    label={translate("ROTATION_GRID")}
                    maxValue={360}
                    minValue={0.001}
                    onFinish={v => updateGizmoGrid("rotationGizmo", v, true)}
                    value={settings.gizmoGrid.rotationGizmo}
                    handleChange={v => updateGizmoGrid("rotationGizmo", v)}
                    isAngle={true}
            />
        </fieldset>
    </Dropdown>
    <div class="button-group">
        <button
                class="button"
                data-highlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
                on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})}>
            <Icon styles="font-size: .9rem">highlight_alt</Icon>
            <ToolTip content={translate("SELECTION")}/>
        </button>
        <button
                class="button"
                data-highlight={settings.gizmo === GIZMOS.CURSOR ? "-" : undefined}
                style="border-top: var(--pj-border-primary) 1px solid"
                on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.CURSOR})}>
            <Icon styles="font-size: .9rem">adjust</Icon>
            <ToolTip content={translate("CURSOR")}/>
        </button>

        <button
                class="button"
                data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
                on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})}>
            <Icon styles="font-size: .9rem">open_with</Icon>
            <ToolTip content={translate("T_GIZMO")}/>
        </button>
        <button
                class="button"
                data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
                on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})}>
            <Icon styles="font-size: .9rem">360</Icon>
            <ToolTip content={translate("R_GIZMO")}/>
        </button>
        <button
                class="button"
                data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
                on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})}>
            <Icon styles="font-size: .9rem">open_in_full</Icon>
            <ToolTip content={translate("S_GIZMO")}/>
        </button>
    </div>
</div>

<style>
    .dropdown {
        display: flex;
        align-items: center;
        gap: 4px;
        border: none;
    }

    .button-group {
        display: flex;
        align-items: center;
        border-collapse: collapse;
    }

    .button {
        height: 22px;
        min-width: 22px;
        max-width: 22px;
        padding: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--pj-background-tertiary);

        border: var(--pj-border-primary) 1px solid;
        border-radius: 0;
    }


    .button:first-child {
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px 0 0 3px;
    }

    .button:last-child {
        border: var(--pj-border-primary) 1px solid;
        border-radius: 0 3px 3px 0;
    }

    .wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .dropdown-content {

        padding: 4px;
        margin-top: 4px;
        margin-bottom: 2px
    }
</style>