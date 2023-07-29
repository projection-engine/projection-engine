<script>

    import ViewHeader from "../../components/view/components/ViewHeader.svelte"
    import MetricsController from "../../../../engine/core/lib/utils/MetricsController"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"

    let isRecording = false
    let isSampling = false
    let toShow = []

    function toggle() {
    	if (isRecording) {
    		toShow = MetricsController.getRecord().sort((a, b) => b.percentage - a.percentage)
    		isRecording = isSampling = false

    	} else {
    		MetricsController.start()
    		isRecording = isSampling = true
    	}
    }
</script>

<ViewHeader>
    <div data-svelteinline="-" style=" width: 100%">
        <button data-sveltebuttondefault="-"
                on:click={toggle}
                data-svelteview-header-button="-"
        >
            {#if isRecording}
                <Icon styles="color: #ff5555">pause</Icon>
            {:else}
                <Icon styles="color: #ff5555">fiber_manual_record</Icon>
            {/if}
            <ToolTip content={isRecording ? LocalizationEN.STOP_RECORDING:LocalizationEN.TOGGLE_RECORD}/>
        </button>
    </div>
</ViewHeader>


<div class="content">
    {#if isSampling}
        <div class="loading-wrapper">
            <small>{LocalizationEN.RECORDING_SAMPLES}</small>
        </div>
    {:else if toShow.length > 0}
        {#each toShow as sample}
            <div class="sample-wrapper">
                <div style={"width: " + (sample.percentage) + "%"} class="bar"></div>
                <div data-svelteinline="-" class="sample">
                    <strong>{sample.flag}</strong>
                    <small>{sample.percentage.toFixed(2)}% ({sample.elapsed + "ms"})</small>
                </div>
                <ToolTip content={sample.elapsed + "ms"}/>
            </div>
        {/each}
    {:else}
        <div class="loading-wrapper">
            <div data-svelteinline="-">
                <small>{LocalizationEN.CLICK_THE_RECORD_BUTTON_TO_RECORD}</small>
                <Icon styles={"color: var(--pj-color-quinary)"}>fiber_manual_record</Icon>
            </div>
        </div>
    {/if}
</div>

<style>
    strong {
        font-size: .8rem;
    }

    small {
        font-size: .7rem;
    }

    .sample-wrapper {
        height: 25px;
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
        border-bottom: var(--pj-border-primary) 1px solid;
    }

    .content {
        overflow-y: auto;
        display: grid;
        height: 100%;
        width: 100%;
        position: relative;
    }

    .loading-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        display: grid;
        justify-content: center;
        align-content: center;
        gap: 8px;
    }

    .bar {
        position: absolute;
        z-index: 10;
        width: 0;
        height: 100%;
        background: var(--pj-accent-color);
    }

    .sample {
        padding: 0 8px;
        width: 100%;
        position: relative;
        z-index: 11;
        justify-content: space-between;
        height: 100%;
    }

    .sample:hover {
        background: var(--pj-border-primary);
    }
</style>
