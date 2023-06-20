<script>

    import SceneComposition from "../../../../../engine-core/runtime/SceneComposition"
    import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS"
    import LocalizationEN from "../../../../../shared/LocalizationEN"
    import OptionDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte"
    import SceneEditorUtil from "../../../util/SceneEditorUtil"

    export let settings

    $: SceneComposition.debugShadingModel = settings?.shadingModel || SHADING_MODELS.ALBEDO
</script>

<OptionDropdown
        noPadding={true}
        options={SceneEditorUtil.getShadingModels()}
        label={LocalizationEN.SHADING + LocalizationEN[SceneEditorUtil.getLabel(settings?.shadingModel)]}
        autoClose={true}
        highlightElementWithId={settings.shadingModel}
/>