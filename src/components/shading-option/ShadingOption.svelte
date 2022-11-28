<script>
    import SHADING_MODELS from "../../../public/engine/static/SHADING_MODELS"
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import FrameComposition from "../../../public/engine/runtime/post-processing/FrameComposition";
    import getLabel from "./utils/get-label";
    import getDropdownHeaderStyles from "../../utils/get-dropdown-header-styles";
    import Options from "./Options.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import SceneRenderer from "../../../public/engine/runtime/rendering/SceneRenderer";

    export let engine
    export let settings

    $: shading = getLabel(settings.shadingModel)
    $: {
        SceneRenderer.debugShadingModel = settings.shadingModel
    }
</script>

<button data-view-header-button="-" data-highlight={settings.outlineEnabled ? "-" : undefined}
        on:click={() => SettingsStore.updateStore({...settings, outlineEnabled: !settings.outlineEnabled})}>
    <Icon styles="font-size: 1rem">border_outer</Icon>
    <ToolTip content={LOCALIZATION_EN.OUTLINE}/>
</button>
<button data-view-header-button="-" data-highlight={settings.overlays ? "-" : undefined}
        on:click={() => SettingsStore.updateStore({...settings, overlays: !settings.overlays})}>
    <Icon styles="font-size: 1rem">layers</Icon>
    <ToolTip content={LOCALIZATION_EN.OVERLAY}/>
</button>

<Dropdown
        styles="width: clamp(250px, 20vw, 500px); padding: 4px; display: flex; flex-direction: column;"
        buttonStyles={getDropdownHeaderStyles()}
>
    <button slot="button" data-view-header-dropdown="-">
        <div style="--color-to-apply: white" data-shaded-material="-"></div>
        <div style="white-space: nowrap">{LOCALIZATION_EN[shading]}</div>
    </button>
    <Options settings={settings}/>
</Dropdown>


