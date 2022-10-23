<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Selector from "../../components/selector/Selector.svelte";
    import Preview from "../../components/preview/Preview.svelte";
    import {onMount} from "svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../templates/Localization";
    import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import FILE_TYPES from "shared-resources/FILE_TYPES";

    export let settings

    const translate = key => Localization.PROJECT.VIEWPORT[key]

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
    <legend>{translate("FOLIAGE_DISPLACEMENT")}</legend>
    <Range label={translate("DENSITY")} value={tS.foliageDensity} minValue={0}
           onFinish={v => update("foliageDensity", v)}/>
    <Range label={translate("TOTAL_QUANTITY")} value={tS.foliageQuantity} minValue={0}
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