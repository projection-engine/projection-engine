<script>
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Selector from "../../../../components/selector/Selector.svelte";
    import AssetAPI from "../../../../lib/fs/AssetAPI";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import RegistryAPI from "../../../../lib/fs/RegistryAPI";
    import TerrainGenerator from "../../../../../public/engine/lib/math/TerrainGenerator";
    import Accordion from "../../../../components/accordion/Accordion.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import GPUAPI from "../../../../../public/engine/lib/rendering/GPUAPI";

    export let item
    export let data

    let store

    let timeout
    let temp
    $: temp = {...data}
    $: isDisabled = !temp.imageID

    async function updateAsset(key, value) {
        let changed = key === "imageID" || temp[key] !== value
        if (!changed)
            return

        if (key === "imageID") {
            const reg = RegistryAPI.getRegistryEntry(value)
            const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + NodeFS.sep + reg.path, "json")

            temp = {...temp, imageID: value, image: file.base64}
        } else
            temp = {...temp, [key]: value}


        const data = await TerrainGenerator.generate(temp.image, temp.scale, temp.dimensions)
        GPUAPI.allocateMesh(item.registryID, data)
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
        }, 750)
    }


</script>

<fieldset>
    <legend>{Localization.IMPORT_IMAGE}</legend>
    <Selector
            type="image"
            selected={temp.imageID}
            handleChange={v => updateAsset("imageID", v.registryID, true)}
    />

    {#if temp.imageID != null}
        <img alt="current image" src={temp.image}>
    {/if}
</fieldset>

<Accordion title={Localization.DIMENSIONS}>
    <Range
            value={temp.scale}
            disabled={isDisabled}
            label={Localization.HEIGHT_SCALE}
            precision={4}
            minValue={.001}
            onFinish={v => updateAsset("scale", v)}
    />
    <Range
            value={temp.dimensions}
            disabled={isDisabled}
            label={Localization.DIMENSION_MULTIPLIER}

            minValue={.001}
            onFinish={v => updateAsset("dimensions", v)}
    />
</Accordion>
