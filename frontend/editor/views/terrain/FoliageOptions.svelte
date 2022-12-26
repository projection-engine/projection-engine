<script>
    import Selector from "../../../components/selector/Selector.svelte";
    import Preview from "../../../components/preview/Preview.svelte";
    import {onMount} from "svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import NodeFS from "../../../lib/FS/NodeFS";
    import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";
    import FILE_TYPES from "../../../../static/objects/FILE_TYPES";
    import Range from "../../../components/range/Range.svelte";
    import Icon from "../../../components/icon/Icon.svelte";

    export let settings


    $: tS = settings.terrainSettings
    $: currentTexture = tS.foliageTexture
    let path
    onMount(() => {
        if (currentTexture != null)
            path = NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep + currentTexture + FILE_TYPES.PREVIEW
    })

    async function update(key, value) {
        if (key === "foliageTexture")
            path = NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep + value + FILE_TYPES.PREVIEW

        SettingsStore.updateStore({...settings, terrainSettings: {...tS, [key]: value}})
    }
</script>

<div class="texture-selector">
    <div class="image-wrapper">
        <Preview path={path}>
            <img draggable="false" slot="image" alt="logo" let:src src={src}>
            <Icon styles="font-size: 2.5rem" slot="icon">image</Icon>
        </Preview>
    </div>
    <Selector
            type="image"
            handleChange={v => update("foliageTexture", v.registryID)}
            selected={currentTexture}
    />
</div>
<fieldset>
    <legend>{LOCALIZATION_EN.FOLIAGE_DISPLACEMENT}</legend>
    <Range label={LOCALIZATION_EN.DENSITY} value={tS.foliageDensity} minValue={0}
           onFinish={v => update("foliageDensity", v)}/>
    <Range label={LOCALIZATION_EN.TOTAL_QUANTITY} value={tS.foliageQuantity} minValue={0}
           onFinish={v => update("foliageQuantity", v)}/>
</fieldset>


<style>

    .texture-selector {
        display: flex;
        gap: 4px;
        align-items: center;
    }

    .image-wrapper {
        min-width: 55px;
        min-height: 55px;
        max-width: 55px;
        max-height: 55px;
        background: var(--pj-background-secondary);
        border-radius: 3px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    img {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>