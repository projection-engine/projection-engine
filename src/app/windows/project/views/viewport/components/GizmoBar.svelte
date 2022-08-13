<script>
    import TRANSFORMATION_TYPE from "../../../static/misc/TRANSFORMATION_TYPE"
    import GIZMOS from "../../../static/misc/GIZMOS"
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import "../css/Viewport.css"
    import ResizableBar from "../../../../../components/resizable/ResizableBar.svelte";
    import GizmoGridSettings from "./settings/GizmoGridSettings.svelte";
    import {onDestroy, onMount} from "svelte";
    import DataStoreController from "../../../stores/DataStoreController";

    const DEFAULT_ROTATION = .1, ROTATION_VALUES = [1, 5, 10, 15, 30, 45, 60, 90]
    const DEFAULT_SCALE = .001, SCALE_VALUES = [.5, 1, 5, 10, 25, 50, 75, 100]
    const DEFAULT_TRANSLATION = .001, TRANSLATION_VALUES = [.5, 1, 5, 10, 25, 50, 75, 100]

    let settings = {}
    const unsubscribeSettings = DataStoreController.getSettings(v => settings=v)
    onDestroy(() => unsubscribeSettings())

    let minimal = true
    let ref
    let initialized = false
    export let translate
    onMount(() => {
        if (ref && settings.extendedGizmoView !== undefined && settings.extendedGizmoView) {
            ref.style.width = "150px"
            minimal = false
        }
    })

</script>

<div class={"floating"}>
    <div class={"content-wrapper"} bind:this={ref}>
        <button
                style="border-radius: 3px"
                data-minimal="{minimal}"
                class={"transformation-wrapper gizmo-bar"}
                on:click={() => {
                if (settings.transformationType !== TRANSFORMATION_TYPE.GLOBAL)
                    settings.transformationType = TRANSFORMATION_TYPE.GLOBAL
                else
                    settings.transformationType = TRANSFORMATION_TYPE.RELATIVE
            }}
        >
            <ToolTip content={`(${settings.transformationType}) Toggle transformation type`}/>
            <Icon styles={{fontSize: "1.1rem"}}>
                {settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? "place" : "language"}
            </Icon>
            {#if !minimal}
                <div data-overflow="-">{settings.transformationType}</div>
            {/if}
        </button>
        <div class={"button-group gizmo-bar"}>
            <GizmoGridSettings
                    label={translate("TRANSLATION_GRID")}
                    minimal={minimal}

                    initialValue={DEFAULT_TRANSLATION}
                    values={TRANSLATION_VALUES}
                    onSave={(value) => {
                    window.renderer.gizmos.translation.gridSize = value
                }}
            >
                <Icon slot="icon" styles="font-size: 1rem">grid_4x4</Icon>
            </GizmoGridSettings>
            <GizmoGridSettings

                    label={translate("SCALE_GRID")}
                    minimal={minimal}

                    initialValue={DEFAULT_SCALE}
                    values={SCALE_VALUES}
                    onSave={(value) => {
                    window.renderer.gizmos.scale.gridSize = value
                }}
            >
                <Icon slot="icon">linear_scale</Icon>
            </GizmoGridSettings>
            <GizmoGridSettings
                    label={translate("ROTATION_GRID")}
                    minimal={minimal}

                    initialValue={DEFAULT_ROTATION}
                    values={ROTATION_VALUES}
                    onSave={(value) => {
                    window.renderer.gizmos.rotation.gridSize = value
                }}
            >
                <Icon slot="icon">rotate_right</Icon>
            </GizmoGridSettings>
        </div>
        <div class={"button-group gizmo-bar"}>
            <button
                    class={"transformation-wrapper gizmo-bar"}
                    data-minimal="{minimal}"
                    data-highlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
                    on:click={() => DataStoreController.updateSettings({...settings, gizmo: GIZMOS.NONE})}>
                <Icon>highlight_alt</Icon>
                <ToolTip content={translate("SELECTION")}/>
                {#if !minimal}
                    <div data-overflow="-">{translate("SELECTION")}</div>
                {/if}
            </button>
            <button
                    class={"transformation-wrapper gizmo-bar"}
                    data-minimal="{minimal}"
                    data-highlight={settings.gizmo === GIZMOS.CURSOR ? "-" : undefined}
                    style="border-top: var(--pj-border-primary) 1px solid"
                    on:click={() => DataStoreController.updateSettings({...settings, gizmo: GIZMOS.CURSOR})}>
                <Icon>adjust</Icon>
                <ToolTip content={translate("CURSOR")}/>
                {#if !minimal}
                    <div data-overflow="-">{translate("CURSOR")}</div>
                {/if}
            </button>
        </div>
        <div class={"button-group gizmo-bar"}>
            <button
                    class={"transformation-wrapper gizmo-bar"}
                    data-minimal="{minimal}"
                    data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
                    on:click={() => DataStoreController.updateSettings({...settings, gizmo: GIZMOS.TRANSLATION})}>
                <Icon>open_with</Icon>
                {#if !minimal}
                    <div data-overflow="-">{translate("T_GIZMO")}</div>
                {/if}
            </button>
            <button
                    class={"transformation-wrapper gizmo-bar"}
                    data-minimal="{minimal}"
                    data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
                    on:click={() => DataStoreController.updateSettings({...settings, gizmo: GIZMOS.ROTATION})}>
                <Icon>360</Icon>
                {#if !minimal}
                    <div data-overflow="-">{translate("R_GIZMO")}</div>
                {/if}
            </button>
            <button
                    class={"transformation-wrapper gizmo-bar"}
                    data-minimal="{minimal}"
                    data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
                    on:click={() => DataStoreController.updateSettings({...settings, gizmo: GIZMOS.SCALE})}>
                <Icon>open_in_full</Icon>
                {#if !minimal}
                    <div data-overflow="-">{translate("S_GIZMO")}</div>
                {/if}
            </button>
        </div>
    </div>
    <ResizableBar
            type={"width"}
            onResizeEnd={() => settings.extendedGizmoView = minimal}
            onResize={() => {
                const bBox = ref.getBoundingClientRect()
                if (bBox.width < 80)
                    minimal = true
                else
                    minimal =false
            }}
    />
    <div style="max-width: 0"></div>
</div>

<style>

    .floating {

        overflow-y: auto;
        overflow-x: hidden;
        width: fit-content;
        max-height: calc(100% - 55px);
        position: absolute;
        left: 0;
        padding-left: 4px;
        top: 28px;
        z-index: 15;
        height: fit-content;
        display: flex;
    }

    .content-wrapper {
        max-width: 250px;
        width: 37px;
        min-width: 37px;
        display: grid;
        align-content: flex-start;
        gap: 8px;
    }

</style>