<script>
    import SHADING_MODELS from "../../public/engine/editor-environment/data/SHADING_MODELS"
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import {onMount} from "svelte";
    import GPUResources from "../../public/engine/GPUResources";
    import GBuffer from "../../public/engine/runtime/renderers/GBuffer";
    import AmbientOcclusion from "../../public/engine/runtime/occlusion/AmbientOcclusion";
    import SettingsStore from "../stores/SettingsStore";
    import Engine from "../../public/engine/Engine";
    import Localization from "../templates/LOCALIZATION_EN";
    import STATIC_SHADERS from "../../public/engine/static/resources/STATIC_SHADERS";
    import SSGIPass from "../../public/engine/runtime/SSGIPass";

    let shadingModel = SHADING_MODELS.DETAIL


    $: shading = (() => {
        switch (shadingModel) {
            case SHADING_MODELS.LIGHT_ONLY:
                return "SHADING_LIGHT"
            case SHADING_MODELS.ALBEDO:
                return "SHADING_UNLIT"
            case SHADING_MODELS.NORMAL:
                return "SHADING_NORMAL"
            case SHADING_MODELS.DEPTH:
                return "SHADING_DEPTH"
            case SHADING_MODELS.G_AO:
            case SHADING_MODELS.AO:
                return "SHADING_AO"
            case SHADING_MODELS.REC_NORMALS:
                return "RECONSTRUCTED_NORMALS"
            case SHADING_MODELS.POSITION:
                return "SHADING_POSITION"
            case SHADING_MODELS.DETAIL:
                return "SHADING_DETAIL"
            case SHADING_MODELS.ROUGHNESS:
                return "SHADING_ROUGHNESS"
            case SHADING_MODELS.METALLIC:
                return "SHADING_METALLIC"
            case SHADING_MODELS.AMBIENT:
                return "SHADING_AMBIENT"
            case SHADING_MODELS.SSGI:
                return "SHADING_SSGI"
            case SHADING_MODELS.STOCHASTIC:
                return "SHADING_STOCHASTIC"
            case SHADING_MODELS.UV:
                return "SHADING_UV"
            case SHADING_MODELS.ID:
                return "SHADING_ID"
            default:
                return ""
        }
    })();

    const getTexture = () => {
        switch (shadingModel) {
            case SHADING_MODELS.UV:
            case SHADING_MODELS.DEPTH:
                return GBuffer.depthUVSampler
            case SHADING_MODELS.AO:
                return AmbientOcclusion.filteredSampler
            case SHADING_MODELS.NORMAL:
                return GBuffer.normalSampler
            case SHADING_MODELS.ALBEDO:
                return GBuffer.albedoSampler
            case SHADING_MODELS.REC_NORMALS:
                return GBuffer.genericNormalSampler
            case SHADING_MODELS.POSITION:
                return GBuffer.positionSampler
            case SHADING_MODELS.G_AO:
            case SHADING_MODELS.ROUGHNESS:
            case SHADING_MODELS.METALLIC:
                return GBuffer.behaviourSampler
            case SHADING_MODELS.AMBIENT:
                return GBuffer.ambientSampler
            case SHADING_MODELS.SSGI:
                return SSGIPass.sampler
            case SHADING_MODELS.STOCHASTIC:
                return SSGIPass.normalSampler

            case SHADING_MODELS.ID:
                return GBuffer.IDSampler
        }

    }
    $: {
        if (Engine.isReady && GBuffer.ready) {
            GBuffer.deferredUniforms.option = shadingModel
            SettingsStore.updateStore({...SettingsStore.data, shadingModel})
            if (shadingModel !== SHADING_MODELS.DETAIL) {
                SSGIPass.uniforms.previousFrame = GBuffer.albedoSampler
                GBuffer.deferredUniforms.uSampler = getTexture()
                GBuffer.deferredShader = GPUResources.shaders.get(STATIC_SHADERS.DEVELOPMENT.DEBUG_DEFERRED)
            } else {
                SSGIPass.uniforms.previousFrame = GBuffer.compositeFBO.colors[0]
                GBuffer.deferredShader = GPUResources.shaders.get(STATIC_SHADERS.PRODUCTION.DEFERRED)
                GBuffer.deferredUniforms.uSampler = GBuffer.compositeFBO.colors[0]
            }
        }
    }

    onMount(() => {
        setTimeout(() => {
            if (SettingsStore.data.shadingModel != null)
                shadingModel = SettingsStore.data.shadingModel
        }, 500)
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
                    on:click={() => shadingModel = SHADING_MODELS.DETAIL}>
                {Localization.SHADING_DETAIL}
                <small>{Localization.DETAIL_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ALBEDO ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.ALBEDO}>
                {Localization.SHADING_UNLIT}
                <small>{Localization.UNLIT_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ROUGHNESS ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.ROUGHNESS}>

                {Localization.SHADING_ROUGHNESS}
                <small>{Localization.ROUGHNESS_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.METALLIC ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.METALLIC}>

                {Localization.SHADING_METALLIC}
                <small>{Localization.METALLIC_DEF}</small>
            </button>
        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.POSITION ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.POSITION}>

                {Localization.SHADING_POSITION}
                <small>{Localization.POSITION_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.G_AO ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.G_AO}>
                {Localization.SHADING_AO}
                <small>{Localization.G_AO_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.NORMAL ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.NORMAL}>

                {Localization.SHADING_NORMAL}
                <small>{Localization.NORMAL_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.AMBIENT ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.AMBIENT}>

                {Localization.SHADING_AMBIENT}
                <small>{Localization.AMBIENT_DEF}</small>
            </button>

        </div>
    </fieldset>
    <fieldset class="content">
        <legend>{Localization.SCENE}</legend>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.REC_NORMALS ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.REC_NORMALS}>
                {Localization.RECONSTRUCTED_NORMALS}
                <small>{Localization.RECONSTRUCTED_NORMALS_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.DEPTH ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.DEPTH}>

                {Localization.SHADING_DEPTH}
                <small>{Localization.DEPTH_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.STOCHASTIC ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.STOCHASTIC}>
                {Localization.SHADING_STOCHASTIC}
                <small>{Localization.STOCHASTIC_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ID ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.ID}>
                {Localization.SHADING_ID}
                <small>{Localization.ID_DEF}</small>
            </button>
        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.AO ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.AO}>
                {Localization.SHADING_AO}
                <small>{Localization.AO_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.SSGI ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.SSGI}>
                {Localization.SHADING_SSGI}
                <small>{Localization.SSGI_DEF}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.UV ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.UV}>
                {Localization.SHADING_UV}
                <small>{Localization.UV_DEF}</small>
            </button>
        </div>

    </fieldset>
</Dropdown>

<style>
    button {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 0 4px;
        font-size: 0.7rem !important;

        border: none;
    }
</style>