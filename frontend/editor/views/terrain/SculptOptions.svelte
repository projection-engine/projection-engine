<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import SettingsStore from "../../stores/SettingsStore";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import {onDestroy, onMount} from "svelte";
    import SculptingGizmo from "../../../../engine-tools/lib/terrain/SculptingGizmo";
    import TerrainGenerator from "../../../../engine-core/lib/math/TerrainGenerator";

    import Selector from "../../../components/selector/Selector.svelte";
    import RegistryAPI from "../../lib/fs/RegistryAPI";
    import FilesAPI from "../../lib/fs/FilesAPI";
    import GPUAPI from "../../../../engine-core/lib/rendering/GPUAPI";
    import Range from "../../../components/range/Range.svelte";
    import NodeFS from "../../../lib/FS/NodeFS";

    export let settings
    export let selectedTerrain

    $: terrainSettings = settings.terrainSettings

    function update(key, value) {
        SettingsStore.updateStore({...settings, terrainSettings: {...settings.terrainSettings, [key]: value}})
    }

    let api

    onMount(() => {
        api = new SculptingGizmo(selectedTerrain.image)
        api.updateMesh = () => {
            TerrainGenerator.generate(api.canvas.toDataURL(), selectedTerrain.scale, selectedTerrain.dimensions)
                .then(res => GPUAPI.allocateMesh(settings.selectedTerrain, res))
        }
    })
    $: if (api) api.updateSettings(terrainSettings.brushSize, terrainSettings.brushScale, terrainSettings.brushStrength)
    onDestroy(() => api.destroy())

    async function updateImage({registryID}) {
        const reg = RegistryAPI.getRegistryEntry(registryID)
        const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + reg.path, "json")

        TerrainGenerator.generate(file.base64, selectedTerrain.scale, selectedTerrain.dimensions)
            .then(res => GPUAPI.allocateMesh(settings.selectedTerrain, res))
    }
</script>
<fieldset>
    <legend>{LOCALIZATION_EN.IMPORT}</legend>
    <Selector
            type="image"
            handleChange={updateImage}

    />
</fieldset>

<div class="boxes">
    <Checkbox
            label={LOCALIZATION_EN.LOWER}
            checked={terrainSettings.brushOnDecrease}
            handleCheck={() => update("brushOnDecrease", true)}/>
    <Checkbox
            label={LOCALIZATION_EN.RAISE}
            checked={!terrainSettings.brushOnDecrease}
            handleCheck={() => update("brushOnDecrease", false)}/>
</div>
<fieldset>
    <legend>{LOCALIZATION_EN.STROKE}</legend>
    <Range
            minValue={0}
            precision={4}
            incrementPercentage={.001}
            label={LOCALIZATION_EN.WIDTH}
            value={terrainSettings.brushSize}
            onFinish={v => update("brushSize", v)}
    />
    <Range
            minValue={0}
            maxValue={1}
            precision={4}
            incrementPercentage={.001}
            label={LOCALIZATION_EN.STRENGTH}
            value={terrainSettings.brushStrength}
            onFinish={v => update("brushStrength", v)}
    />
    <Range
            minValue={0}
            maxValue={1}
            precision={4}
            incrementPercentage={.001}
            label={LOCALIZATION_EN.SCALE}
            value={terrainSettings.brushScale * 100}
            onFinish={v => update("brushScale", v/100)}
    />
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