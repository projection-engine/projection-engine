<script>
    import Localization from "../../../../../shared/libs/Localization";

    import Range from "../../../../../shared/components/range/Range.svelte";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import AssetAPI from "../../../../../shared/libs/files/AssetAPI";

    import {onDestroy} from "svelte";
    import FilesAPI from "../../../../../shared/libs/files/FilesAPI";
    import FilesStore from "../../../../stores/FilesStore";
    import RegistryAPI from "../../../../../shared/libs/files/RegistryAPI";
    import TerrainWorker from "../../../../../../public/engine/production/workers/terrain/TerrainWorker";
    import {GPU} from "../../../../../../public/engine/production";
    import TerrainEditor from "./TerrainEditor.svelte";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";

    export let item
    export let data

    let store

    let isOnEdit = false
    let timeout
    let temp
    $: temp = {...data}
    $: isDisabled = !temp.imageID

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    async function updateAsset(key, value, imageChange) {
        let changed = temp[key] !== value
        if (!changed)
            return
        if (key === "imageID") {
            try {
                const reg = await RegistryAPI.readRegistryFile(value)
                const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path, "json")
                temp = {...temp, imageID: value, image: file.base64}
            } catch (error) {
                console.error(error)
            }
        } else
            temp = {...temp, [key]: value}
        if (imageChange) {
            const data = await TerrainWorker.generate(temp.image, temp.scale, temp.dimensions)
            GPU.allocateMesh(item.registryID, data)

            clearTimeout(timeout)
            timeout = setTimeout(async () => {
                await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
            }, 750)
        } else {
            alert.pushAlert(translate("UPDATING_ASSET"), "alert")
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))

            clearTimeout(timeout)
            timeout = setTimeout(async () => {

                alert.pushAlert("Updating mesh", "warning")
                const data = await TerrainWorker.generate(temp.image, temp.scale, temp.dimensions)
                GPU.allocateMesh(item.registryID, data)
            }, 750)
        }
    }


</script>

<fieldset>
    <legend>{translate("IMPORT_IMAGE")}</legend>
    <Selector
            type="image"
            selected={temp.imageID}
            handleChange={v => {
                updateAsset("imageID", v.registryID)
            }}
    />

</fieldset>

<Accordion title={translate("DIMENSIONS")} startOpen={true}>
    <Range
            value={temp.scale}
            disabled={isDisabled}
            label={translate("HEIGHT_SCALE")}
            precision={4}
            minValue={.001}
            onFinish={v => {
                updateAsset("scale", v)
            }}
    />
    <Range
            value={temp.dimensions}
            disabled={isDisabled}
            label={translate("DIMENSION_MULTIPLIER")}
            precision={4}
            minValue={.001}
            onFinish={v => {
                updateAsset("dimensions", v)
            }}
    />
</Accordion>


{#if !isOnEdit}
    <button
            data-focusbutton="-"
            style="height: 25px"
            on:click={() => isOnEdit = true}
    >{translate("EDIT_HEIGHT_MAP")}</button>
{:else}
    <TerrainEditor data={temp} id={item.id} update={b64 => updateAsset("image", b64, true)}/>
{/if}