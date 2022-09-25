<script>
    import ResizableBar from "../../../../../shared/components/resizable/ResizableBar.svelte";
    import Range from "../../../../../shared/components/range/Range.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import {onDestroy, onMount} from "svelte";
    import SculptingGizmo from "../../../../../../public/engine/editor/libs/terrain/SculptingGizmo";
    import TerrainWorker from "../../../../../../public/engine/production/workers/terrain/TerrainWorker";
    import {GPU} from "../../../../../../public/engine/production";

    export let settings
    export let selectedTerrain

    const translate = key => Localization.PROJECT.VIEWPORT[key]
    $: terrainSettings = settings.terrainSettings

    function update(key, value) {
        SettingsStore.updateStore({...settings, terrainSettings: {...settings.terrainSettings, [key]: value}})
    }

    let api

    onMount(() => {


        api = new SculptingGizmo(selectedTerrain.image)

        api.updateMesh = () => {
            console.log(api.canvas.toDataURL())
            TerrainWorker.generate(api.canvas.toDataURL(), selectedTerrain.scale, selectedTerrain.dimensions)
                .then(res => {
                    console.log(res)
                    GPU.allocateMesh(settings.selectedTerrain, res)
                })
        }
    })
    $: {
        if (api) {
            api.ctx.lineWidth = terrainSettings.brushSize
            const d = terrainSettings.brushStrength * 255
            api.ctx.strokeStyle = `rgb(${d}, ${d}, ${d})`
        }
    }
    onDestroy(() => api.destroy())
</script>


<div class="boxes">
    <Checkbox
            label={translate("LOWER")}
            checked={terrainSettings.brushOnDecrease}
            handleCheck={() => update("brushOnDecrease", true)}/>
    <Checkbox
            label={translate("RAISE")}
            checked={!terrainSettings.brushOnDecrease}
            handleCheck={() => update("brushOnDecrease", false)}/>
</div>
<fieldset>
    <legend>{translate("STROKE")}</legend>
    <Range
            minValue={0}
            precision={4}
            incrementPercentage={.001}
            label={translate("WIDTH")}
            value={terrainSettings.brushSize}
            onFinish={v => update("brushSize", v)}
    />
    <Range
            minValue={0}
            maxValue={1}
            precision={4}
            incrementPercentage={.001}
            label={translate("STRENGTH")}
            value={terrainSettings.brushStrength}
            onFinish={v => update("brushStrength", v)}/>
</fieldset>


<style>
    fieldset {
        padding: 0;
    }

    legend {
        margin-bottom: 4px;

    }


    .boxes {
        display: grid;
        gap: 2px;
        padding: 2px;
        border-radius: 3px;
        background: var(--pj-background-secondary);
    }
</style>