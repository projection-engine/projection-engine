<script>
    import TRANSFORMATION_TYPE from "../../../static/misc/TRANSFORMATION_TYPE"
    import GIZMOS from "../../../static/misc/GIZMOS"
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import {settingsStore} from "../../../stores/settings-store";
    import {get} from "svelte/store";
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import ResizableBar from "../../../../../components/resizable/ResizableBar.svelte";
    import GridSizeSelector from "./settings/GizmoGridSettings.svelte";

    const DEFAULT_ROTATION = .1, ROTATION_VALUES = [1, 5, 10, 15, 30, 45, 60, 90]
    const DEFAULT_SCALE = .001, SCALE_VALUES = [.5, 1, 5, 10, 25, 50, 75, 100]
    const DEFAULT_TRANSLATION = .001, TRANSLATION_VALUES = [.5, 1, 5, 10, 25, 50, 75, 100]

    const settings = get(settingsStore)
    let minimal = false
    let ref
    let initialized = false
    export let translate
    $: {
        if (ref && !initialized && settings.extendedGizmoView !== undefined && settings.extendedGizmoView) {
            ref.style.width = "150px"
            minimal = false
            initialized = true
        }
    }

</script>

<div class={"floating"}>
    <div class={"contentWrapper"} bind:this={ref}>
        <button
            style={{borderRadius: "3px"}}
            data-minimal="{minimal}"
            class={"transformationWrapper"}
            onClick={() => {
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
            <div class={"overflow"}>{settings.transformationType}</div>
            {/if}
        </button>
        <div class={"buttonGroup"}>
            <GridSizeSelector
                label={translate("TRANSLATION_GRID")}
                minimal={minimal}

                initialValue={DEFAULT_TRANSLATION}
                values={TRANSLATION_VALUES}
                onSave={(value) => {
                    window.renderer.gizmos.translation.gridSize = value
                }}
            >
                <Icon slot="icon" styles="font-size: 1rem">grid_4x4</Icon>
            </GridSizeSelector>
            <GridSizeSelector

                label={translate("SCALE_GRID")}
                minimal={minimal}

                initialValue={DEFAULT_SCALE}
                values={SCALE_VALUES}
                onSave={(value) => {
                    window.renderer.gizmos.scale.gridSize = value
                }}
            >
                <Icon slot="icon">linear_scale</Icon>
            </GridSizeSelector>
            <GridSizeSelector
                label={translate("ROTATION_GRID")}
                minimal={minimal}

                initialValue={DEFAULT_ROTATION}
                values={ROTATION_VALUES}
                onSave={(value) => {
                    window.renderer.gizmos.rotation.gridSize = value
                }}
            >
                <Icon slot="icon">rotate_right</Icon>
            </GridSizeSelector>
        </div>
        <div class={"buttonGroup"}>
            <button
                class={"transformationWrapper"}
                data-minimal="{minimal}"
                data-highlight={settings.gizmo === GIZMOS.NONE ? "filled" : undefined}
                on:click={() => settings.gizmo = GIZMOS.NONE}>
                <Icon>highlight_alt</Icon>
                <ToolTip content={translate("SELECTION")}/>
                {#if !minimal}
                    <div class={"overflow"}>{translate("SELECTION")}</div>
                {/if}
            </button>
            <button
                class={"transformationWrapper"}
                data-minimal="{minimal}"
                data-highlight={settings.gizmo === GIZMOS.CURSOR ? "-" : undefined}
                style="border-top: var(--pj-border-primary) 1px solid"
                on:click={() => settings.gizmo = GIZMOS.CURSOR}>
                <Icon>adjust</Icon>
                <ToolTip content={translate("CURSOR")}/>
                {#if !minimal}
                    <div class={"overflow"}>{translate("CURSOR")}</div>
                {/if}
            </button>
        </div>
        <div class={"buttonGroup"}>
            <button
                class={"transformationWrapper"}
                data-minimal="{minimal}"
                data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
                on:click={() => settings.gizmo = GIZMOS.TRANSLATION}>
                <Icon>open_with</Icon>
                {#if !minimal}
                    <div class={"overflow"}>{translate("T_GIZMO")}</div>
                {/if}
            </button>
            <button
                class={"transformationWrapper"}
                data-minimal="{minimal}"
                data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
                on:click={() => settings.gizmo = GIZMOS.ROTATION}>
                <Icon>360</Icon>
                {#if !minimal}
                    <div class={"overflow"}>{translate("R_GIZMO")}</div>
                {/if}
            </button>
            <button
                class={"transformationWrapper"}
                data-minimal="{minimal.toString()}"
                data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
                on:click={() => settings.gizmo = GIZMOS.SCALE}>
                <Icon>open_in_full</Icon>
                {#if !minimal}
                    <label class={"overflow"}>{translate("S_GIZMO")}</label>
                {/if}
            </button>
        </div>
    </div>
    <ResizableBar
        type={"width"}
        onResizeEnd={() => settings.extendedGizmoView = minimal}
        onResize={() => {
            const bBox = ref.current.getBoundingClientRect()
            if (bBox.width < 80)
                minimal = true
            else
                minimal =false
        }}
    />
    <div style="max-width: 0"></div>
</div>
