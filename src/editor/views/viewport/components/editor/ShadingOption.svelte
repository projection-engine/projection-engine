<script>
    import SHADING_MODELS from "../../../../data/SHADING_MODELS"
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import {onDestroy} from "svelte";
    import GPU from "../../../../../../public/engine/production/GPU";
    import DepthPass from "../../../../../../public/engine/production/passes/rendering/DepthPass";
    import DeferredPass from "../../../../../../public/engine/production/passes/rendering/DeferredPass";
    import AOPass from "../../../../../../public/engine/production/passes/rendering/AOPass";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Engine from "../../../../../../public/engine/production/Engine";
    import Localization from "../../../../../shared/libs/Localization";
    import STATIC_SHADERS from "../../../../../../public/engine/static/resources/STATIC_SHADERS";

    let shadingModel = SHADING_MODELS.DETAIL
    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => unsubscribeSettings())
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
            case SHADING_MODELS.AO:
                return "SHADING_AO"
            case SHADING_MODELS.DETAIL:
                return "SHADING_DETAIL"
            default:
                return {}
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
        }

    }
    $: {
        if (Engine.isReady && DeferredPass.ready) {
            DeferredPass.deferredUniforms.option = shadingModel
            if (shadingModel !== SHADING_MODELS.DETAIL) {
                DeferredPass.deferredUniforms.uSampler = getTexture()
                DeferredPass.deferredShader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.DEBUG_DEFERRED)
            } else {
                DeferredPass.deferredShader = GPU.shaders.get(STATIC_SHADERS.PRODUCTION.DEFERRED)
                DeferredPass.deferredUniforms.uSampler = DeferredPass.compositeFBO.colors[0]
            }
        }

        if (!settings.ao && shadingModel === SHADING_MODELS.AO) {
            shadingModel = SHADING_MODELS.DETAIL
            alert.pushAlert(translate("SHADING_SWITCH"), "info")
        }
    }
</script>

<Dropdown asButton={true} styles="width: clamp(250px, 20vw, 500px);">
    <button class="summary" slot="button">
        <div style="--color-to-apply: white" data-shaded-material="-"></div>
        <div style="white-space: nowrap">{translate(shading)}</div>
    </button>
    <div class="content">
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.DETAIL ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.DETAIL}>
                {translate("SHADING_DETAIL")}
                <small>{translate("DETAIL_DEF")}</small>
            </button>
            <button disabled on:click={() => shadingModel = SHADING_MODELS.LIGHT_ONLY}>
                {translate("SHADING_LIGHT")}
                <small>{translate("LIGHT_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.ALBEDO ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.ALBEDO}>
                {translate("SHADING_UNLIT")}
                <small>{translate("UNLIT_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.REC_NORMALS ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.REC_NORMALS}>
                {translate("RECONSTRUCTED_NORMALS")}
                <small>{translate("RECONSTRUCTED_NORMALS_DEF")}</small>
            </button>
        </div>
        <div class="column">
            <button data-highlight={shadingModel === SHADING_MODELS.AO ? "-" : ""} disabled="{!settings.ao}"
                    on:click={() => shadingModel = SHADING_MODELS.AO}>
                {translate("SHADING_AO")}
                <small>{translate("AO_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.DEPTH ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.DEPTH}>

                {translate("SHADING_DEPTH")}
                <small>{translate("DEPTH_DEF")}</small>
            </button>
            <button data-highlight={shadingModel === SHADING_MODELS.NORMAL ? "-" : ""}
                    on:click={() => shadingModel = SHADING_MODELS.NORMAL}>

                {translate("SHADING_NORMAL")}
                <small>{translate("NORMAL_DEF")}</small>
            </button>
        </div>
    </div>
</Dropdown>

<style>
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