<script>
    import SHADING_MODELS from "../../public/engine/editor/shaders/SHADING_MODELS"
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import {onMount} from "svelte";
    import GPU from "../../public/engine/production/GPU";
    import DepthPass from "../../public/engine/production/passes/rendering/DepthPass";
    import DeferredPass from "../../public/engine/production/passes/rendering/DeferredPass";
    import AOPass from "../../public/engine/production/passes/rendering/AOPass";
    import SettingsStore from "../stores/SettingsStore";
    import Engine from "../../public/engine/production/Engine";
    import Localization from "../libs/Localization";
    import STATIC_SHADERS from "../../public/engine/static/resources/STATIC_SHADERS";
    import SSGIPass from "../../public/engine/production/passes/rendering/SSGIPass";

    let shadingModel = SHADING_MODELS.DETAIL

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

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
            case SHADING_MODELS.DEPTH:
                return DepthPass.depthSampler
            case SHADING_MODELS.AO:
                return AOPass.filteredSampler
            case SHADING_MODELS.NORMAL:
                return DeferredPass.normalSampler
            case SHADING_MODELS.ALBEDO:
                return DeferredPass.albedoSampler
            case SHADING_MODELS.REC_NORMALS:
                return DepthPass.normalSampler
            case SHADING_MODELS.POSITION:
                return DeferredPass.positionSampler
            case SHADING_MODELS.G_AO:
            case SHADING_MODELS.ROUGHNESS:
            case SHADING_MODELS.METALLIC:
                return DeferredPass.behaviourSampler
            case SHADING_MODELS.AMBIENT:
                return DeferredPass.ambientSampler
            case SHADING_MODELS.SSGI:
                return SSGIPass.sampler
            case SHADING_MODELS.STOCHASTIC:
                return SSGIPass.normalSampler
            case SHADING_MODELS.UV:
                return DepthPass.UVSampler
            case SHADING_MODELS.ID:
                return DepthPass.IDSampler
        }

    }
    $: {
        if (Engine.isReady && DeferredPass.ready) {
            DeferredPass.deferredUniforms.option = shadingModel
            SettingsStore.updateStore({...SettingsStore.data, shadingModel})
            if (shadingModel !== SHADING_MODELS.DETAIL) {
                SSGIPass.uniforms.previousFrame = DeferredPass.albedoSampler
                DeferredPass.deferredUniforms.uSampler = getTexture()
                DeferredPass.deferredShader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.DEBUG_DEFERRED)
            } else {
                SSGIPass.uniforms.previousFrame = DeferredPass.compositeFBO.colors[0]
                DeferredPass.deferredShader = GPU.shaders.get(STATIC_SHADERS.PRODUCTION.DEFERRED)
                DeferredPass.deferredUniforms.uSampler = DeferredPass.compositeFBO.colors[0]
            }
        }
    }

    onMount(() => {
        setTimeout(() => {
            if(SettingsStore.data.shadingModel != null)
            shadingModel = SettingsStore.data.shadingModel
        }, 500)
    })
</script>

<Dropdown styles="width: clamp(250px, 20vw, 500px);">
    <button class="summary" slot="button">
        <div style="--color-to-apply: white" data-shaded-material="-"></div>
        <div style="white-space: nowrap">{translate(shading)}</div>
    </button>
    <fieldset class="content">
        <legend>{translate("G_BUFFER")}</legend>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.DETAIL ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.DETAIL}>
                {translate("SHADING_DETAIL")}
                <small>{translate("DETAIL_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ALBEDO ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.ALBEDO}>
                {translate("SHADING_UNLIT")}
                <small>{translate("UNLIT_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ROUGHNESS ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.ROUGHNESS}>

                {translate("SHADING_ROUGHNESS")}
                <small>{translate("ROUGHNESS_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.METALLIC ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.METALLIC}>

                {translate("SHADING_METALLIC")}
                <small>{translate("METALLIC_DEF")}</small>
            </button>
        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.POSITION ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.POSITION}>

                {translate("SHADING_POSITION")}
                <small>{translate("POSITION_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.G_AO ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.G_AO}>
                {translate("SHADING_AO")}
                <small>{translate("G_AO_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.NORMAL ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.NORMAL}>

                {translate("SHADING_NORMAL")}
                <small>{translate("NORMAL_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.AMBIENT ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.AMBIENT}>

                {translate("SHADING_AMBIENT")}
                <small>{translate("AMBIENT_DEF")}</small>
            </button>

        </div>
    </fieldset>
    <fieldset class="content">
        <legend>{translate("SCENE")}</legend>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.REC_NORMALS ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.REC_NORMALS}>
                {translate("RECONSTRUCTED_NORMALS")}
                <small>{translate("RECONSTRUCTED_NORMALS_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.DEPTH ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.DEPTH}>

                {translate("SHADING_DEPTH")}
                <small>{translate("DEPTH_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.STOCHASTIC ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.STOCHASTIC}>
                {translate("SHADING_STOCHASTIC")}
                <small>{translate("STOCHASTIC_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ID ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.ID}>
                {translate("SHADING_ID")}
                <small>{translate("ID_DEF")}</small>
            </button>
        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.AO ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.AO}>
                {translate("SHADING_AO")}
                <small>{translate("AO_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.SSGI ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.SSGI}>
                {translate("SHADING_SSGI")}
                <small>{translate("SSGI_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.UV ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.UV}>
                {translate("SHADING_UV")}
                <small>{translate("UV_DEF")}</small>
            </button>
        </div>

    </fieldset>
</Dropdown>

<style>
    button{
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