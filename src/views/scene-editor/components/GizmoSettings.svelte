<script>
    import TRANSFORMATION_TYPE from "../../../static/TRANSFORMATION_TYPE"

    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import GizmoSystem from "../../../lib/engine-tools/runtime/GizmoSystem";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import GridSystem from "../../../lib/engine-tools/runtime/GridSystem";
    import TranslationGizmo from "../../../lib/engine-tools/lib/transformation/TranslationGizmo";
    import ScalingGizmo from "../../../lib/engine-tools/lib/transformation/ScalingGizmo";
    import RotationGizmo from "../../../lib/engine-tools/lib/transformation/RotationGizmo";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";
    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
    import GIZMOS from "../../../static/GIZMOS";


    export let settings

    const updateGizmoGrid = (key, value, submit) => {
        switch (key) {
            case key === "scalingGizmo":
                ScalingGizmo.gridSize = value
                break
            case key === "translationGizmo":
                TranslationGizmo.gridSize = value
                break
            case key === "rotationGizmo":
                RotationGizmo.gridSize = value
                break
        }
        GizmoSystem[key]
        if (submit)
            SettingsStore.updateStore({...settings, gizmoGrid: {...settings.gizmoGrid, [key]: value}})
    }
    $ : {
        GizmoSystem.transformationType = settings.transformationType
    }
</script>

<div class="wrapper">
    <button
            on:click={() => SettingsStore.updateStore({...settings, transformationType: settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? TRANSFORMATION_TYPE.GLOBAL : TRANSFORMATION_TYPE.RELATIVE})}
            class="button viewport"
    >
        {#if settings.transformationType === TRANSFORMATION_TYPE.RELATIVE}
            <Icon styles="font-size: .9rem">place</Icon>
            {Localization.LOCAL}
        {:else}
            <Icon styles="font-size: .9rem">language</Icon>
            {Localization.GLOBAL}
        {/if}
        <ToolTip content={Localization.TOGGLE_TRANSFORMATION_TYPE}/>
    </button>

    <Dropdown buttonStyles={getDropdownHeaderStyles()}>
        <button slot="button" data-view-header-dropdown="-">
            <Icon styles="font-size: .9rem">straighten</Icon>
            <ToolTip content={Localization.MOVEMENT_GRID}/>
        </button>
        <fieldset class="dropdown-content">
            <legend>{Localization.MOVEMENT_GRID}</legend>
            <Range
                    variant="embedded"
                    label={Localization.TRANSLATION_GRID}
                    precision="3"
                    maxValue={10}
                    minValue={0.001}
                    onFinish={v => updateGizmoGrid("translationGizmo", v, true)}
                    value={settings.gizmoGrid.translationGizmo}
                    handleChange={v => {
                            GridSystem.metadataBuffer[1] = v
                    }}

            />
            <Range
                    variant="embedded"
                    label={Localization.SCALE_GRID}
                    precision="3"
                    maxValue={10}
                    minValue={0.001}
                    onFinish={v => updateGizmoGrid("scaleGizmo", v, true)}
                    value={settings.gizmoGrid.scaleGizmo}
            />
            <Range
                    variant="embedded"
                    precision="3"
                    label={Localization.ROTATION_GRID}
                    maxValue={360}
                    minValue={0.001}
                    onFinish={v => updateGizmoGrid("rotationGizmo", v, true)}
                    value={settings.gizmoGrid.rotationGizmo}
            />
        </fieldset>
        <div data-divider="-"></div>
        <div style="padding: 4px;">
            <Range
                    variant="embedded"
                    precision={4}
                    label={Localization.SENSITIVITY}
                    minValue={0}
                    onFinish={v => updateGizmoGrid("sensitivity", v / 100, true)}
                    value={settings.gizmoGrid.sensitivity * 100}
            />
        </div>
    </Dropdown>

    <button
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})}>
        <Icon styles="font-size: 1rem; color: #FFC757">highlight_alt</Icon>

        {LOCALIZATION_EN.SELECTION}

        <ToolTip content={LOCALIZATION_EN.SELECTION}/>
    </button>
    <button
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_with</Icon>
        {LOCALIZATION_EN.T_GIZMO}

        <ToolTip content={LOCALIZATION_EN.T_GIZMO}/>
    </button>
    <button

            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">360</Icon>
        {LOCALIZATION_EN.R_GIZMO}

        <ToolTip content={LOCALIZATION_EN.R_GIZMO}/>
    </button>
    <button

            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_in_full</Icon>
        {LOCALIZATION_EN.S_GIZMO}
        <ToolTip content={LOCALIZATION_EN.S_GIZMO}/>
    </button>
</div>

<style>
    .wrapper {
        display: flex;
        align-items: flex-start;
        gap: 4px;
    }

    .dropdown-content {

        padding: 4px;
        margin-top: 4px;
        margin-bottom: 2px
    }
</style>