<script>
    import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS"
    import SettingsStore from "../../../../shared/stores/SettingsStore"
    import LocalizationEN from "../../../../../shared/LocalizationEN"


    export let settings
    $: shadingModel = settings.shadingModel
</script>


<fieldset>
    <legend>{LocalizationEN.MISC}</legend>
    <div data-sveltebuttongroup="-">
        <div data-sveltebuttongrouprow="-">
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.DETAIL ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DETAIL})}
                    class="button"
            >
                {LocalizationEN.SHADING_DETAIL}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.LIGHT_QUANTITY ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_QUANTITY})}>
                {LocalizationEN.LIGHT_QUANTITY}
            </button>
        </div>
    </div>
</fieldset>
<fieldset>
    <legend>{LocalizationEN.MATERIAL}</legend>
    <div data-sveltebuttongroup="-">
        <div data-sveltebuttongrouprow="-">
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.ALBEDO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ALBEDO})}>
                {LocalizationEN.SHADING_UNLIT}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.ROUGHNESS ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ROUGHNESS})}>
                {LocalizationEN.SHADING_ROUGHNESS}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.LIGHT_ONLY ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_ONLY})}>
                {LocalizationEN.LIGHT_ONLY}
            </button>
        </div>
        <div data-sveltebuttongrouprow="-">
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.METALLIC ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.METALLIC})}>
                {LocalizationEN.SHADING_METALLIC}
            </button>
            <button data-sveltehighlight={shadingModel === SHADING_MODELS.G_AO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.G_AO})}>
                {LocalizationEN.SHADING_AO}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.NORMAL ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.NORMAL})}>
                {LocalizationEN.SHADING_NORMAL}
            </button>
        </div>
    </div>

</fieldset>

<fieldset>
    <legend>{LocalizationEN.DEBUG_SHADING}</legend>

    <div data-sveltebuttongroup="-">
        <div data-sveltebuttongrouprow="-">
            <button data-sveltehighlight={shadingModel === SHADING_MODELS.DEPTH ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DEPTH})}>
                {LocalizationEN.SHADING_DEPTH}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.RANDOM ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.RANDOM})}>
                {LocalizationEN.SHADING_RANDOM}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.LIGHT_COMPLEXITY ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_COMPLEXITY})}>
                {LocalizationEN.LIGHT_COMPLEXITY}
            </button>
        </div>
        <div data-sveltebuttongrouprow="-">
            <button data-sveltehighlight={shadingModel === SHADING_MODELS.POSITION ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.POSITION})}>
                {LocalizationEN.POSITION}
            </button>
            <button data-sveltehighlight={shadingModel === SHADING_MODELS.AO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.AO})}>
                {LocalizationEN.SHADING_DYNAMIC_AO}
            </button>
            <button data-sveltehighlight={shadingModel === SHADING_MODELS.OVERDRAW ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.OVERDRAW})}>
                {LocalizationEN.OVERDRAW}
            </button>
        </div>
    </div>

</fieldset>


<style>
    fieldset {
        background: var(--pj-background-primary);
    }

    .button {
        background: var(--pj-background-primary);
    }

    .row > button {
        width: 100%;
        height: 100%;
    }

</style>