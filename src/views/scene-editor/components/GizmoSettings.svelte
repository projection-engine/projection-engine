<script>
    import TRANSFORMATION_TYPE from "../../../data/TRANSFORMATION_TYPE"

    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import GizmoSystem from "../../../../public/engine/editor-environment/services/GizmoSystem";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import GridSystem from "../../../../public/engine/editor-environment/services/GridSystem";


    export let settings

    const updateGizmoGrid = (key, value, submit) => {
        GizmoSystem[key].gridSize = value
        if (submit)
            SettingsStore.updateStore({...settings, gizmoGrid: {...settings.gizmoGrid, [key]: value}})
    }
</script>

<div class="wrapper">
    <Dropdown>
        <button slot="button" class="dropdown" style="background: transparent">
            {#if settings.transformationType === TRANSFORMATION_TYPE.RELATIVE}
                <Icon styles="font-size: .9rem">
                    place
                </Icon>
                {Localization.LOCAL}
            {:else}
                <Icon styles="font-size: .9rem">
                    language
                </Icon>
                {Localization.GLOBAL}

            {/if}
            <ToolTip content={Localization.TRANSFORMATION_ORIENTATION}/>
        </button>

        <button data-highlight={settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? "" : "-"}
                on:click={() => {
                    settings.transformationType = TRANSFORMATION_TYPE.GLOBAL
                    GizmoSystem.transformationType = TRANSFORMATION_TYPE.GLOBAL
                }}>
            <Icon>language</Icon>
            {Localization.GLOBAL}
        </button>
        <button data-highlight={settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? "-" : ""}
                on:click={() => {
                    settings.transformationType = TRANSFORMATION_TYPE.RELATIVE
                    GizmoSystem.transformationType = TRANSFORMATION_TYPE.RELATIVE
                }}>
            <Icon>place</Icon>
            {Localization.LOCAL}
        </button>
    </Dropdown>
    <Dropdown>
        <button slot="button" class="dropdown">
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

</div>

<style>
    .dropdown {
        display: flex;
        align-items: center;
        gap: 4px;
        border: none;
    }


    .wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .dropdown-content {

        padding: 4px;
        margin-top: 4px;
        margin-bottom: 2px
    }
</style>