<script>

    import getLabel from "../utils/get-label"
    import SceneComposition from "../../../../../engine-core/runtime/SceneComposition"
    import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS"
    import LocalizationEN from "../../../../../shared/LocalizationEN"
    import OptionDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte";
    import getShadingModels from "../utils/get-shading-models";

    export let settings

    $: shading = getLabel(settings?.shadingModel)
    $: SceneComposition.debugShadingModel = settings?.shadingModel || SHADING_MODELS.ALBEDO
</script>

<OptionDropdown
        noPadding={true}
        options={getShadingModels(settings)}
        label={LocalizationEN.SHADING + LocalizationEN[shading]}
        autoClose={true}
        highlightElementWithId={settings.shadingModel}
/>