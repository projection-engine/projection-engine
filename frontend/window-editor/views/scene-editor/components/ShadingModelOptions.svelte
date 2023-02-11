<script>
    import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS"
    import SettingsStore from "../../../../shared/stores/SettingsStore";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";

    export let settings
    $: shadingModel = settings.shadingModel
</script>


<button
        data-sveltebuttondefault="-"

        data-sveltehighlight={shadingModel === SHADING_MODELS.DETAIL ? "-" : ""}
        on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DETAIL})}
        class="button"
>
    {LOCALIZATION_EN.SHADING_DETAIL}
</button>

<fieldset>
    <legend>{LOCALIZATION_EN.MATERIAL}</legend>
    <div data-sveltebuttongroup="-">
        <div data-sveltebuttongrouprow="-">
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.ALBEDO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ALBEDO})}>
                {LOCALIZATION_EN.SHADING_UNLIT}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.ROUGHNESS ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ROUGHNESS})}>
                {LOCALIZATION_EN.SHADING_ROUGHNESS}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.LIGHT_ONLY ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_ONLY})}>
                {LOCALIZATION_EN.LIGHT_ONLY}
            </button>
        </div>
        <div data-sveltebuttongrouprow="-">
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.METALLIC ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.METALLIC})}>
                {LOCALIZATION_EN.SHADING_METALLIC}
            </button>
            <button  data-sveltehighlight={shadingModel === SHADING_MODELS.G_AO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.G_AO})}>
                {LOCALIZATION_EN.SHADING_AO}
            </button>
            <button
                    data-sveltehighlight={shadingModel === SHADING_MODELS.NORMAL ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.NORMAL})}>
                {LOCALIZATION_EN.SHADING_NORMAL}
            </button>
        </div>
    </div>

</fieldset>

<fieldset>
    <legend>{LOCALIZATION_EN.DEBUG_SHADING}</legend>

    <div class="row">
        <button  data-sveltehighlight={shadingModel === SHADING_MODELS.DEPTH ? "-" : ""}
                on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DEPTH})}>
            {LOCALIZATION_EN.SHADING_DEPTH}
        </button>
        <button
                data-sveltehighlight={shadingModel === SHADING_MODELS.RANDOM ? "-" : ""}
                on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.RANDOM})}>
            {LOCALIZATION_EN.SHADING_RANDOM}
        </button>
        <button
                data-sveltehighlight={shadingModel === SHADING_MODELS.LIGHT_COMPLEXITY ? "-" : ""}
                on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_COMPLEXITY})}>
            {LOCALIZATION_EN.LIGHT_COMPLEXITY}
        </button>

    </div>
    <div class="row">
        <button  data-sveltehighlight={shadingModel === SHADING_MODELS.POSITION ? "-" : ""}
                on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.POSITION})}>
            {LOCALIZATION_EN.POSITION}
        </button>
        <button  data-sveltehighlight={shadingModel === SHADING_MODELS.AO ? "-" : ""}
                on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.AO})}>
            {LOCALIZATION_EN.SHADING_DYNAMIC_AO}
        </button>
        <button  data-sveltehighlight={shadingModel === SHADING_MODELS.OVERDRAW ? "-" : ""}
                on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.OVERDRAW})}>
            {LOCALIZATION_EN.OVERDRAW}
        </button>
    </div>
    <div class="row">
        <button
                data-sveltehighlight={shadingModel === SHADING_MODELS.LIGHT_QUANTITY ? "-" : ""}
                on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_QUANTITY})}>
            {LOCALIZATION_EN.LIGHT_QUANTITY}
        </button>
    </div>
</fieldset>


<style>
    fieldset {
        background: var(--pj-background-primary);
    }

    .button {
        background: var(--pj-background-primary);
    }


    .row {
        width: 100%;
        gap: 3px;
        display: flex;
        height: 25px;
    }

    .row > button {
        width: 100%;
        height: 100%;
    }

</style>