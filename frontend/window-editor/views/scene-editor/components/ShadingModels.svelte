<script>
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import getLabel from "../utils/get-label";
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import Options from "./ShadingModelOptions.svelte";
    import SceneComposition from "../../../../../engine-core/runtime/SceneComposition";
    import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";

    export let engine
    export let settings

    $: shading = getLabel(settings?.shadingModel)
    $:SceneComposition.debugShadingModel = settings?.shadingModel || SHADING_MODELS.ALBEDO
</script>


<Dropdown
        styles="width: clamp(250px, 20vw, 500px); padding: 4px; display: flex; flex-direction: column;"
        buttonStyles={getDropdownHeaderStyles()}
>
    <button data-sveltebuttondefault="-"  slot="button" data-svelteview-header-dropdown="-">
        <span style="--color-to-apply: white" data-svelteshaded-material="-"></span>
        <span style="white-space: nowrap">{LOCALIZATION_EN[shading]}</span>
    </button>
    <Options settings={settings}/>
</Dropdown>

<style>
    button{
        width: 7rem;
    }
</style>