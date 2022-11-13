<script>
    import SHADING_MODELS from "../../public/engine/editor-environment/static/SHADING_MODELS"
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import {onMount} from "svelte";
    import GPU from "../../public/engine/GPU";
    import GBuffer from "../../public/engine/runtime/rendering/GBuffer";
    import SettingsStore from "../stores/SettingsStore";
    import Engine from "../../public/engine/Engine";
    import Localization from "../templates/LOCALIZATION_EN";
    import STATIC_SHADERS from "../../public/engine/static/resources/STATIC_SHADERS";
    import FrameComposition from "../../public/engine/runtime/post-processing/FrameComposition";
    import CameraAPI from "../../public/engine/lib/utils/CameraAPI";
    import VisualsStore from "../stores/VisualsStore";
    import getLabel from "./shading-option/utils/get-label";
    import getTexture from "./shading-option/utils/get-texture";

    export let engine
    export let settings
    $: shadingModel = settings.shadingModel
    $: shading = getLabel(settings.shadingModel)


    $: {
        FrameComposition.debugFlag = shadingModel
        if (shadingModel !== SHADING_MODELS.DETAIL) {
            FrameComposition.workerTexture = getTexture(shadingModel)
            FrameComposition.shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.DEBUG_DEFERRED)
            FrameComposition.updateShader()
        } else {
            FrameComposition.shader = GPU.shaders.get(STATIC_SHADERS.PRODUCTION.FRAME_COMPOSITION)
            FrameComposition.updateShader()
            CameraAPI.updateMotionBlurState(VisualsStore.data.motionBlurEnabled)
        }
    }

    onMount(() => {
        console.trace(shadingModel)
    })
</script>

<Dropdown styles="width: clamp(250px, 20vw, 500px); padding: 4px; display: flex; flex-direction: column;">
    <button class="summary" slot="button">
        <div style="--color-to-apply: white" data-shaded-material="-"></div>
        <div style="white-space: nowrap">{Localization[shading]}</div>
    </button>
    <fieldset class="content">
        <legend>{Localization.G_BUFFER}</legend>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.DETAIL ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DETAIL})}>
                {Localization.SHADING_DETAIL}
                <small>{Localization.DETAIL_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ALBEDO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ALBEDO})}>
                {Localization.SHADING_UNLIT}
                <small>{Localization.UNLIT_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ROUGHNESS ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ROUGHNESS})}>

                {Localization.SHADING_ROUGHNESS}
                <small>{Localization.ROUGHNESS_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.METALLIC ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.METALLIC})}>

                {Localization.SHADING_METALLIC}
                <small>{Localization.METALLIC_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.DEPTH ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DEPTH})}>

                {Localization.SHADING_DEPTH}
                <small>{Localization.DEPTH_DEF}</small>
            </button>
        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.POSITION ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.POSITION})}>

                {Localization.SHADING_POSITION}
                <small>{Localization.POSITION_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.G_AO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.G_AO})}>
                {Localization.SHADING_AO}
                <small>{Localization.G_AO_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.NORMAL ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.NORMAL})}>

                {Localization.SHADING_NORMAL}
                <small>{Localization.NORMAL_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.VELOCITY ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.VELOCITY})}>
                {Localization.SHADING_VELOCITY}
                <small>{Localization.VELOCITY_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.UV ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.UV})}>
                {Localization.SHADING_UV}
                <small>{Localization.UV_DEF}</small>
            </button>
        </div>
    </fieldset>
    <fieldset class="content">
        <legend>{Localization.SCENE}</legend>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.SSR ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.SSR})}>
                {Localization.SHADING_SSR}
                <small>{Localization.SSR}</small>
            </button>

            <button data-highlight={shadingModel === SHADING_MODELS.STOCHASTIC ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.STOCHASTIC})}>
                {Localization.SHADING_STOCHASTIC}
                <small>{Localization.STOCHASTIC_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ID ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ID})}>
                {Localization.SHADING_ID}
                <small>{Localization.ID_DEF}</small>
            </button>
        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.AO ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.AO})}>
                {Localization.SHADING_AO}
                <small>{Localization.AO_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.SSGI ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.SSGI})}>
                {Localization.SHADING_SSGI}
                <small>{Localization.SSGI_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.SSGI_UNFILTERED ? "-" : ""}
                    on:click={() => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.SSGI_UNFILTERED})}>
                {Localization.SHADING_SSGI}
                <small>{Localization.SSGI_UNFILTERED_DEF}</small>
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
        background: var(--pj-background-secondary);
    }


    .summary {
        background: transparent;
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 0 4px;
        font-size: 0.7rem !important;

        border: none;
    }
</style>