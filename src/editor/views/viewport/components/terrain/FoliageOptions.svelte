<script>
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import Preview from "../../../../../shared/components/preview/Preview.svelte";
    import {onMount} from "svelte";
    import RegistryAPI from "../../../../../shared/libs/files/RegistryAPI";
    import FilesStore from "../../../../stores/FilesStore";
    import FilesAPI from "../../../../../shared/libs/files/FilesAPI";
    import SettingsStore from "../../../../stores/SettingsStore";

    export let settings

    $: currentTexture = settings.terrainSettings.foliageTexture
    let path
    onMount(() => {
        if (currentTexture != null)
            RegistryAPI.readRegistryFile(currentTexture).then(res => path = FilesStore.ASSETS_PATH + FilesAPI.sep + res?.path)
    })

    async function update(key, value) {
        if (key === "foliageTexture") {
            const res = await RegistryAPI.readRegistryFile(value)
            path = FilesAPI.path + FilesAPI.sep + "previews" + FilesAPI.sep + currentTexture + ".preview"
        }
        SettingsStore.updateStore({...settings, terrainSettings: {...settings.terrainSettings, [key]: value}})
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