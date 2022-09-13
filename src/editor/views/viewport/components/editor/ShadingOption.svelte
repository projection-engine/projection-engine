<script>
    import SHADING_MODELS from "../../../../data/SHADING_MODELS"
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import {onDestroy} from "svelte";
    import CompositePass from "../../../../../../public/engine/production/passes/post-processing/CompositePass";
    import GPU from "../../../../../../public/engine/production/GPU";
    import STATIC_FRAMEBUFFERS from "../../../../../../public/engine/static/resources/STATIC_FRAMEBUFFERS";
    import DepthPass from "../../../../../../public/engine/production/passes/effects/DepthPass";
    import DeferredPass from "../../../../../../public/engine/production/passes/rendering/DeferredPass";
    import AOPass from "../../../../../../public/engine/production/passes/effects/AOPass";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Engine from "../../../../../../public/engine/production/Engine";

    let shadingModel = SHADING_MODELS.DETAIL
    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings=v)
    onDestroy(() => unsubscribeSettings())
    export let translate = () => null
    $: shading = (() => {
        switch (shadingModel) {
            case SHADING_MODELS.LIGHT_ONLY:
                return {
                    icon: "light_bulb",
                    label: "SHADING_LIGHT"
                }
            case SHADING_MODELS.ALBEDO:
                return {
                    label: "SHADING_UNLIT",
                    icon: "category"
                }
            case SHADING_MODELS.NORMAL:
                return {
                    icon: "category",
                    label: "SHADING_NORMAL"
                }
            case SHADING_MODELS.DEPTH:
                return {
                    icon: "settings",
                    label: "SHADING_DEPTH"
                }
            case SHADING_MODELS.AO:
                return {
                    icon: "settings",
                    label: "SHADING_AO"
                }

            case SHADING_MODELS.DETAIL:
                return {
                    label: "SHADING_DETAIL",
                    icon: "shaded"
                }
            default:
                return {}
        }
    })();

    const getTexture = () => {
        switch (shadingModel) {
            case SHADING_MODELS.DEPTH:
                return DepthPass.depth
            case SHADING_MODELS.AO:
                return AOPass.filteredSampler
            case SHADING_MODELS.NORMAL:
                return DeferredPass.normalSampler
            case SHADING_MODELS.ALBEDO:
                return DeferredPass.albedoSampler
        }

    }
    $: {
        if (Engine.isReady) {
            if (shadingModel !== SHADING_MODELS.DETAIL)
                CompositePass.workerTexture = getTexture()
            else
                CompositePass.workerTexture = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.POST_PROCESSING_WORKER).colors[0]
        }
        if (!settings.ao && shadingModel === SHADING_MODELS.AO) {
            shadingModel = SHADING_MODELS.DETAIL
            alert.pushAlert(translate("SHADING_SWITCH"), "info")
        }
    }
</script>

<Dropdown asButton={true}>
    <button class="summary" slot="button">
        {#if shadingModel === SHADING_MODELS.DETAIL}
            <div style="--color-to-apply: white" class={"shaded-icon"}></div>
        {:else if shadingModel === SHADING_MODELS.ALBEDO}
            <div style="--color-to-apply: white" class={"flat-icon"}></div>
        {:else}
            <Icon styles="font-size: 1rem; min-width: 1.1rem">{shading.icon}</Icon>
        {/if}
        <div style="white-space: nowrap">{translate(shading.label)}</div>
    </button>
    <button
            on:click={() => shadingModel = SHADING_MODELS.DETAIL}
    >
        {#if shadingModel === SHADING_MODELS.DETAIL}
            <Icon styles="font-size: 1rem; min-width: 1.1rem">check</Icon>
        {/if}
        {translate("SHADING_DETAIL")}
    </button>
    <button
            on:click={() => shadingModel = SHADING_MODELS.LIGHT_ONLY}
    >
        {#if shadingModel === SHADING_MODELS.LIGHT_ONLY}
            <Icon styles="font-size: 1rem; min-width: 1.1rem">check</Icon>
        {/if}
        {translate("SHADING_LIGHT")}
    </button>
    <button
            on:click={() => shadingModel = SHADING_MODELS.ALBEDO}
    >
        {#if shadingModel === SHADING_MODELS.ALBEDO}
            <Icon styles="font-size: 1rem; min-width: 1.1rem">check</Icon>
        {/if}
        {translate("SHADING_UNLIT")}
    </button>
    <button
            disabled="{!settings.ao}"
            on:click={() => shadingModel = SHADING_MODELS.AO}
    >
        {#if shadingModel === SHADING_MODELS.AO}
            <Icon styles="font-size: 1rem; min-width: 1.1rem">check</Icon>
        {/if}
        {translate("SHADING_AO")}
    </button>
    <button
            on:click={() => shadingModel = SHADING_MODELS.DEPTH}
    >
        {#if shadingModel === SHADING_MODELS.DEPTH}
            <Icon styles="font-size: 1rem; min-width: 1.1rem">check</Icon>
        {/if}
        {translate("SHADING_DEPTH")}
    </button>
    <button
            on:click={() => shadingModel = SHADING_MODELS.NORMAL}
    >
        {#if shadingModel === SHADING_MODELS.NORMAL}
            <Icon styles="font-size: 1rem; min-width: 1.1rem">check</Icon>
        {/if}
        {translate("SHADING_NORMAL")}
    </button>
</Dropdown>

<style>

    .shaded-icon {
        transition: 150ms linear;
        background: linear-gradient(to right bottom, var(--color-to-apply) 25%, #333 75%);
        min-width: 13px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
    }

    .flat-icon {
        transition: 150ms linear;
        min-width: 13px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: var(--color-to-apply);
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