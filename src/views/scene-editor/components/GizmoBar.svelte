<script>

    import GIZMOS from "../../../data/GIZMOS"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import "../../viewport/css/styles.css"
    import Localization from "../../../libs/libs/Localization";

    let hidden = false
    export let settings


    const translate = key => Localization.PROJECT.VIEWPORT[key]
</script>
<div class="wrapper">
    <div class="content">
        <button
                class:visible={!hidden}
                class="button viewport"
                style="border-radius: 3px;"
                data-highlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
                on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})}>
            <Icon styles="font-size: 1.15rem; color: #FFC757">highlight_alt</Icon>
            {#if !hidden}
                {translate("SELECTION")}
            {/if}
            <ToolTip content={translate("SELECTION")}/>
        </button>

        <div class="button-group viewport">
            <button
                    class:visible={!hidden}
                    class="button viewport"
                    data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
                    on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})}>
                <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">open_with</Icon>
                {#if !hidden}
                    {translate("T_GIZMO")}
                {/if}
                <ToolTip content={translate("T_GIZMO")}/>
            </button>
            <button
                    class:visible={!hidden}
                    class="button viewport"
                    data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
                    on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})}>
                <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">360</Icon>
                {#if !hidden}
                    {translate("R_GIZMO")}
                {/if}
                <ToolTip content={translate("R_GIZMO")}/>
            </button>
            <button
                    class:visible={!hidden}
                    class="button viewport"
                    data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
                    on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})}>
                <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">open_in_full</Icon>
                {#if !hidden}
                    {translate("S_GIZMO")}
                {/if}
                <ToolTip content={translate("S_GIZMO")}/>
            </button>
        </div>
    </div>
    <ResizableBar
            onResizeEnd={(_, previous) => {
                const bBox = previous.getBoundingClientRect()
                if(bBox.width <= 45)
                    hidden = true
            }}
            onResizeStart={() => hidden = false}
            type="width"
    />
    <div style="max-width: 0"></div>
</div>

<style>
    .visible {
        justify-content: flex-start;
        gap: 4px;
        white-space: nowrap;
        overflow: hidden;
        padding: 0 4px;

    }

    .wrapper {
        position: absolute;
        left: 0;
        z-index: 10;
        top: 28px;
        padding: 4px;
        display: flex;
        width: fit-content;

    }

    .content {
        min-width: 40px;
        overflow: hidden;
        width: 150px;
        display: grid;
        gap: 8px;

    }
</style>