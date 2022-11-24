<script>
    import SHADING_MODELS from "../../lib/engine-tools/static/SHADING_MODELS"
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import FrameComposition from "../../../public/engine/runtime/post-processing/FrameComposition";
    import getLabel from "./utils/get-label";
    import getTexture from "./utils/get-texture";
    import getDropdownHeaderStyles from "../../utils/get-dropdown-header-styles";
    import DebugPass from "../../lib/engine-tools/runtime/DebugPass";

    export let engine
    export let settings
    $: shadingModel = settings.shadingModel
    $: shading = getLabel(settings.shadingModel)

    $: {
        FrameComposition.debugFlag = shadingModel
        // if (!GBuffer.__cacheCallback)
        //     GBuffer.__cacheCallback = GBuffer.drawToBuffer
        // if (shadingModel !== SHADING_MODELS.DETAIL) {
        //     DebugPass.sampler = getTexture(shadingModel)
        //     DebugPass.flag = shadingModel
        //     GBuffer.drawToBuffer = DebugPass.execute
        // } else
        //     GBuffer.drawToBuffer = GBuffer.__cacheCallback
    }

</script>

<Dropdown styles="width: clamp(250px, 20vw, 500px); padding: 4px; display: flex; flex-direction: column;"
          buttonStyles={getDropdownHeaderStyles()}>
    <button slot="button" data-view-header-dropdown="-">
        <div style="--color-to-apply: white" data-shaded-material="-"></div>
        <div style="white-space: nowrap">{LOCALIZATION_EN[shading]}</div>
    </button>
    <fieldset class="content">
        <legend>{LOCALIZATION_EN.G_BUFFER}</legend>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.DETAIL ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DETAIL})}>
                {LOCALIZATION_EN.SHADING_DETAIL}
                <small>{LOCALIZATION_EN.DETAIL_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ALBEDO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ALBEDO})}>
                {LOCALIZATION_EN.SHADING_UNLIT}
                <small>{LOCALIZATION_EN.UNLIT_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ROUGHNESS ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ROUGHNESS})}>

                {LOCALIZATION_EN.SHADING_ROUGHNESS}
                <small>{LOCALIZATION_EN.ROUGHNESS_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.METALLIC ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.METALLIC})}>

                {LOCALIZATION_EN.SHADING_METALLIC}
                <small>{LOCALIZATION_EN.METALLIC_DEF}</small>
            </button>

        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.POSITION ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.POSITION})}>

                {LOCALIZATION_EN.SHADING_POSITION}
                <small>{LOCALIZATION_EN.POSITION_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.G_AO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.G_AO})}>
                {LOCALIZATION_EN.SHADING_AO}
                <small>{LOCALIZATION_EN.G_AO_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.NORMAL ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.NORMAL})}>
                {LOCALIZATION_EN.SHADING_NORMAL}
                <small>{LOCALIZATION_EN.NORMAL_DEF}</small>
            </button>
        </div>
    </fieldset>

    <fieldset class="content">
        <legend>{LOCALIZATION_EN.SCENE}</legend>
        <div class="column">

            <button data-highlight={shadingModel === SHADING_MODELS.SSR ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.SSR})}>
                {LOCALIZATION_EN.SHADING_SSR}
                <small>{LOCALIZATION_EN.SSR}</small>
            </button>
            <button
                    data-highlight={shadingModel === SHADING_MODELS.RANDOM ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.RANDOM})}>
                {LOCALIZATION_EN.SHADING_RANDOM}
                <small>{LOCALIZATION_EN.SHADING_RANDOM_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.AO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.AO})}>
                {LOCALIZATION_EN.SHADING_AO}
                <small>{LOCALIZATION_EN.AO_DEF}</small>
            </button>

        </div>
        <div class="column">

            <button data-highlight={shadingModel === SHADING_MODELS.SSGI ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.SSGI})}>
                {LOCALIZATION_EN.SHADING_SSGI}
                <small>{LOCALIZATION_EN.SSGI_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.MATERIALS ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.MATERIALS})}>
                {LOCALIZATION_EN.MATERIALS}
                <small>{LOCALIZATION_EN.MATERIALS_TO_DRAW}</small>
            </button>
        </div>

    </fieldset>
</Dropdown>

<style>
    button {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: var(--pj-background-primary);
    }

    .content {
        display: flex;
        width: 100%;
        overflow: hidden;
        gap: 3px;
        padding: 3px;
        background: transparent;
    }

    .column {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 3px;
    }

    .column > button {
        border: none;
        height: 30px;
        display: grid;
        justify-content: flex-start;
        justify-items: flex-start;
    }


</style>