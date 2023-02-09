<script>
    import TRANSFORMATION_TYPE from "../../../static/TRANSFORMATION_TYPE.ts"

    import SettingsStore from "../../../../shared/stores/SettingsStore";
    import GizmoSystem from "../../../../../engine-tools/runtime/GizmoSystem";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import TranslationGizmo from "../../../../../engine-tools/lib/transformation/TranslationGizmo";
    import ScalingGizmo from "../../../../../engine-tools/lib/transformation/ScalingGizmo";
    import RotationGizmo from "../../../../../engine-tools/lib/transformation/RotationGizmo";
    import GIZMOS from "../../../static/GIZMOS.ts";
    import ROTATION_GRID from "../static/ROTATION_GRID";
    import SCALE_GRID from "../static/SCALE_GRID";
    import TRANSLATION_GRID from "../static/TRANSLATION_GRID";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";

    const BUTTON_DROPDOWN = "border-radius: 25px; height: 25px; background: var(--pj-background-tertiary);"
    const BUTTON_DROPDOWN_INT = "background: transparent; box-shadow: none; width: 50px; justify-content: center; gap: 6px"
    export let settings

    const updateGizmoGrid = (key, value) => {
        switch (key) {
            case key === "scalingGizmo":
                ScalingGizmo.gridSize = value
                break
            case key === "translationGizmo":
                TranslationGizmo.gridSize = value
                break
            case key === "rotationGizmo":
                RotationGizmo.gridSize = value * Math.PI / 180
                break
        }

        SettingsStore.updateStore({...settings, gizmoGrid: {...settings.gizmoGrid, [key]: value}})
    }
    $ : {
        GizmoSystem.transformationType = settings.transformationType
        GizmoSystem.sensitivity = settings.gizmoGrid.sensitivity / 100 || .001
    }
</script>

<div class="wrapper">
    <button data-sveltebuttondefault="-"
            on:click={() => SettingsStore.updateStore({...settings, transformationType: settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? TRANSFORMATION_TYPE.GLOBAL : TRANSFORMATION_TYPE.RELATIVE})}
            class="button viewport"
    >
        {#if settings.transformationType === TRANSFORMATION_TYPE.RELATIVE}
            <Icon styles="font-size: .9rem">place</Icon>
            {LOCALIZATION_EN.LOCAL}
        {:else}
            <Icon styles="font-size: .9rem">language</Icon>
            {LOCALIZATION_EN.GLOBAL}
        {/if}
        <ToolTip content={LOCALIZATION_EN.TOGGLE_TRANSFORMATION_TYPE}/>
    </button>

    <Dropdown hideArrow={true} buttonStyles={BUTTON_DROPDOWN}>
        <button data-sveltebuttondefault="-"
                slot="button"
                style={BUTTON_DROPDOWN_INT}
                class="button viewport"
        >
            <ToolTip content={LOCALIZATION_EN.TRANSLATION_GRID}/>
            {settings.gizmoGrid.translationGizmo}
            <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_with</Icon>
        </button>

        {#each TRANSLATION_GRID as value}
            <button data-sveltebuttondefault="-"  data-svelteinline="-" on:click={() => updateGizmoGrid("translationGizmo", value)}>
                {#if settings.gizmoGrid.translationGizmo === value}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {value}
            </button>
        {/each}
    </Dropdown>
    <Dropdown hideArrow={true} buttonStyles={BUTTON_DROPDOWN}>
        <button data-sveltebuttondefault="-"
                slot="button"
                style={BUTTON_DROPDOWN_INT}
                class="button viewport"
        >
            <ToolTip content={LOCALIZATION_EN.SCALE_GRID}/>
            {settings.gizmoGrid.scaleGizmo}
            <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_in_full</Icon>
        </button>

        {#each SCALE_GRID as value}
            <button data-sveltebuttondefault="-"  data-svelteinline="-" on:click={() => updateGizmoGrid("scaleGizmo", value)}>
                {#if settings.gizmoGrid.scaleGizmo === value}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {value}
            </button>
        {/each}
    </Dropdown>
    <Dropdown hideArrow={true} buttonStyles={BUTTON_DROPDOWN }>
        <button data-sveltebuttondefault="-"
                slot="button"
                style={BUTTON_DROPDOWN_INT}
                class="button viewport"
        >
            <ToolTip content={LOCALIZATION_EN.ROTATION_GRID}/>
            {settings.gizmoGrid.rotationGizmo}
            <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">360</Icon>
        </button>

        {#each ROTATION_GRID as value}
            <button data-sveltebuttondefault="-"  data-svelteinline="-" on:click={() => updateGizmoGrid("rotationGizmo", value)}>
                {#if settings.gizmoGrid.rotationGizmo === value}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {value}
            </button>
        {/each}
    </Dropdown>


    <button data-sveltebuttondefault="-"
            class="button viewport"
            style="margin-left: 8px"
            data-sveltehighlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})}>
        <Icon styles="font-size: 1rem; color: #FFC757">highlight_alt</Icon>

        {LOCALIZATION_EN.SELECTION}

        <ToolTip content={LOCALIZATION_EN.SELECTION}/>
    </button>
    <button data-sveltebuttondefault="-"
            class="button viewport"
            data-sveltehighlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_with</Icon>
        {LOCALIZATION_EN.T_GIZMO}

        <ToolTip content={LOCALIZATION_EN.T_GIZMO}/>
    </button>

    <button data-sveltebuttondefault="-"

            class="button viewport"
            data-sveltehighlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_in_full</Icon>
        {LOCALIZATION_EN.S_GIZMO}
        <ToolTip content={LOCALIZATION_EN.S_GIZMO}/>
    </button>
    <button data-sveltebuttondefault="-"

            class="button viewport"
            data-sveltehighlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">360</Icon>
        {LOCALIZATION_EN.R_GIZMO}

        <ToolTip content={LOCALIZATION_EN.R_GIZMO}/>
    </button>
</div>

<style>
    .wrapper {
        display: flex;
        align-items: flex-start;
        gap: 4px;
    }
</style>