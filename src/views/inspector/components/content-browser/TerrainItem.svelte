<script>
    import Localization from "../../../../libs/Localization";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Selector from "../../../../components/selector/Selector.svelte";
    import AssetAPI from "../../../../libs/AssetAPI";
    import FilesAPI from "../../../../libs/FilesAPI";
    import RegistryAPI from "../../../../libs/RegistryAPI";
    import TerrainWorker from "../../../../../public/engine/workers/terrain/TerrainWorker";
    import Accordion from "../../../../components/accordion/Accordion.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import GPUResources from "../../../../../public/engine/GPUResources";
    import GPUController from "../../../../../public/engine/GPUController";

    export let item
    export let data

    let store

    let timeout
    let temp
    $: temp = {...data}
    $: isDisabled = !temp.imageID

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    async function updateAsset(key, value) {
        let changed = key === "imageID" || temp[key] !== value
        if (!changed)
            return

        if (key === "imageID") {
            const reg = await RegistryAPI.readRegistryFile(value)
            const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + NodeFS.sep + reg.path, "json")

            temp = {...temp, imageID: value, image: file.base64}
        } else
            temp = {...temp, [key]: value}


        const data = await TerrainWorker.generate(temp.image, temp.scale, temp.dimensions)
        GPUController.allocateMesh(item.registryID, data)
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
        }, 750)
    }


</script>

<fieldset>
    <legend>{translate("IMPORT_IMAGE")}</legend>
    <Selector
            type="image"
            selected={temp.imageID}
            handleChange={v => updateAsset("imageID", v.registryID, true)}
    />

    {#if temp.imageID != null}
        <img alt="current image" src={temp.image}>
    {/if}
</fieldset>

<Accordion title={translate("DIMENSIONS")}>
    <Range
            value={temp.scale}
            disabled={isDisabled}
            label={translate("HEIGHT_SCALE")}
            precision={4}
            minValue={.001}
            onFinish={v => updateAsset("scale", v)}
    />
    <Range
            value={temp.dimensions}
            disabled={isDisabled}
            label={translate("DIMENSION_MULTIPLIER")}
            precision={4}
            minValue={.001}
            onFinish={v => updateAsset("dimensions", v)}
    />
</Accordion>
