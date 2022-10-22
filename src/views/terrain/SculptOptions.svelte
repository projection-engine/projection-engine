<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../libs/Localization";
    import SettingsStore from "../../stores/SettingsStore";
    import Checkbox from "../../components/checkbox/Checkbox.svelte";
    import {onDestroy, onMount} from "svelte";
    import SculptingGizmo from "../../../public/engine/editor/libs/terrain/SculptingGizmo";
    import TerrainWorker from "../../../public/engine/workers/terrain/TerrainWorker";

    import Selector from "../../components/selector/Selector.svelte";
    import RegistryAPI from "../../libs/RegistryAPI";
    import FilesAPI from "../../libs/FilesAPI";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import GPU from "../../../public/engine/GPU";

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
            TerrainWorker.generate(api.canvas.toDataURL(), selectedTerrain.scale, selectedTerrain.dimensions)
                .then(res => GPU.allocateMesh(settings.selectedTerrain, res))
        }
    })
    $: if (api) api.updateSettings(terrainSettings.brushSize, terrainSettings.brushScale, terrainSettings.brushStrength)
    onDestroy(() => api.destroy())

    async function updateImage({registryID}) {
        const reg = await RegistryAPI.readRegistryFile(registryID)
        const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + reg.path, "json")

        console.log(file)
        TerrainWorker.generate(file.base64, selectedTerrain.scale, selectedTerrain.dimensions)
            .then(res => GPU.allocateMesh(settings.selectedTerrain, res))
    }
</script>
<fieldset>
    <legend>{translate("IMPORT")}</legend>
    <Selector
            type="image"
            handleChange={updateImage}

    />
</fieldset>

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
            onFinish={v => update("brushStrength", v)}
    />
    <Range
            minValue={0}
            maxValue={1}
            precision={4}
            incrementPercentage={.001}
            label={translate("SCALE")}
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