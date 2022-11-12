<script>
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import {onDestroy, onMount} from "svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import ConsoleAPI from "../../../public/engine/lib/utils/ConsoleAPI";
    import BenchmarkAPI from "../../../public/engine/lib/utils/BenchmarkAPI";
    import Engine from "../../../public/engine/Engine";
    import Range from "shared-resources/frontend/components/range/Range.svelte"
    import {v4} from "uuid";
    import BENCHMARK_KEYS from "../../../public/engine/static/BENCHMARK_KEYS";

    let isRecording = false
    let samples = 0
    let isSampling = false
    let interval
    let toShow = []
    const loadingBarID = v4()

    onMount(() => {
        samples = BenchmarkAPI.maxSamples
    })
    onDestroy(() => {
        clearInterval(interval)
    })

    function update() {
        const cache = []
        const sampleCountInterval = BenchmarkAPI.contexts.get(BENCHMARK_KEYS.ALL)[1].reduce((partialSum, a) => partialSum + a, 0)
        Array.from(BenchmarkAPI.contexts.entries()).forEach(context => {
            if(context[0] === BENCHMARK_KEYS.ALL)
                return
            const elapsed = context[1][1].reduce((partialSum, a) => partialSum + a, 0)
            cache.push({
                label: context[0],
                elapsed: elapsed.toFixed(3),
                percentage: (elapsed > 0 ? (elapsed/sampleCountInterval) * 100: 0)
            })
        })
        toShow = cache.sort((a,b) => b.percentage - a.percentage)
    }

    function toggleSampling() {
        clearInterval(interval)
        isRecording = Engine.benchmarkMode = isSampling = !isRecording
        if (isRecording) {
            let el = document.getElementById(loadingBarID)
            interval = setInterval(() => {
                if (!el) {
                    el = document.getElementById(loadingBarID)
                } else
                    el.style.width = (BenchmarkAPI.currentSamples / samples) * 100 + "%"
            }, 150)
            BenchmarkAPI.onSampleCount = () => {
                update()
                toggleSampling()
            }
        }
    }
</script>
<ViewHeader>
    <div data-inline="-" style="width: 100%; border-bottom: var(--pj-border-primary) 1px solid; height: 100%">
        <div data-inline="-" style=" width: 100%">
            <button
                    on:click={toggleSampling}
                    class="button"
            >
                <Icon styles={isRecording ? "color: #ff5555" : "color: var(--pj-color-quinary)"}>fiber_manual_record</Icon>
                <ToolTip content={LOCALIZATION_EN.TOGGLE_RECORD}/>
            </button>
            <button
                    on:click={() => {
                BenchmarkAPI.contexts.forEach(c => {
                    c[0] = 0
                    c[1].forEach((_, i) => c[1][i] = 0)
                })
                toShow = []
            }} class="button"
            >
                <Icon styles="color: var(--pj-color-quaternary)">refresh</Icon>
                <small>{LOCALIZATION_EN.RESET}</small>
                <ToolTip content={LOCALIZATION_EN.RESET}/>
            </button>
        </div>
        <div data-inline="-" style="justify-content: flex-end; width: clamp(100px, 30%, 250px)">
            <Range
                    integer="true"
                    label={LOCALIZATION_EN.SAMPLES}
                    value={samples}
                    minValue={100}
                    onFinish={v => {
                      BenchmarkAPI.maxSamples = v
                      samples = v
                }}
            />
        </div>
    </div>
</ViewHeader>


<div class="content">
    {#if isSampling}
        <div class="loading-wrapper">
            <small>{LOCALIZATION_EN.RECORDING_SAMPLES}</small>
            <div class="loading-bar">
                <div id={loadingBarID} class="bar"></div>
            </div>
        </div>
    {:else if toShow.length > 0}
        {#each toShow as sample}
            <div class="sample-wrapper">
                <div style={"width: " + sample.percentage + "%"} class="bar"></div>
                <div data-inline="-" class="sample">
                    <strong>{sample.label}</strong>
                    <small>{sample.elapsed}ms</small>
                </div>
            </div>
        {/each}
    {:else}
        <div class="loading-wrapper">
            <div data-inline="-">
                <small>{LOCALIZATION_EN.CLICK_THE_RECORD_BUTTON_TO_RECORD}</small>
                <Icon styles={"color: var(--pj-color-quinary)"}>fiber_manual_record</Icon>.
            </div>
        </div>
    {/if}
</div>

<style>
    strong{
        font-size: .8rem;
    }
    small{
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

    .button {
        height: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border: none;
        white-space: nowrap;
    }

    .button[data-metadata="-"] {
        background: var(--pj-border-primary);
    }

    .loading-bar {
        width: 100%;
        border-radius: 25px;
        height: 25px;
        overflow: hidden;
        position: relative;
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
    .sample:hover{
        background: var(--pj-border-primary);
    }
</style>