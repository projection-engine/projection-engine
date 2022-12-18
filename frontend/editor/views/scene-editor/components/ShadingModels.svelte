<script>
    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
    import getLabel from "../utils/get-label";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";
    import Options from "./ShadingModelOptions.svelte";
    import SceneRenderer from "../../../../../engine-core/runtime/rendering/SceneRenderer";
    import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";

    export let engine
    export let settings

    $: shading = getLabel(settings?.shadingModel)
    $: {
        console.trace("IM HERE", SceneRenderer.debugShadingModel, settings.shadingModel)
        SceneRenderer.debugShadingModel = settings?.shadingModel||SHADING_MODELS.DETAIL
    }
</script>


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


