<script>
    import Localization from "../../../../../libs/Localization";
    import FilesStore from "../../../../stores/FilesStore";
    import FilesAPI from "../../../../../libs/files/FilesAPI";
    import FILE_TYPES from "../../../../../../static/FILE_TYPES";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import TextureItem from "./TextureItem.svelte";
    import ComponentItem from "./ComponentItem.svelte";
    import ItemMetadata from "./ItemMetadata.svelte";
    import MaterialItem from "./MaterialItem.svelte";

    const {shell} = window.require("electron")

    export let item
    let data
    let type

    const translate = key => Localization.PROJECT.INSPECTOR[key]
    $: fileType = "." + item.type

    $: {

        if (fileType === FILE_TYPES.TEXTURE || fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.MATERIAL) {
            FilesAPI.readFile(FilesStore.ASSETS_PATH + item.id, fileType !== FILE_TYPES.COMPONENT ? "json" : undefined).then(res => data = res)
        } else
            data = undefined
    }

</script>

<div class="wrapper">

    <ItemMetadata item={item}/>
    <div data-divider="-" style="margin-top: 6px; margin-bottom: 6px;"></div>
    {#if fileType === FILE_TYPES.TEXTURE}
        <TextureItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.COMPONENT}
        <ComponentItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.MATERIAL && data?.response != null}
        <MaterialItem data={data} item={item}/>
    {:else}
        <div class="empty-wrapper">
        <div data-empty="-" style="position: relative">
            <Icon styles="font-size: 75px">category</Icon>
            {translate("TITLE")}
        </div>
        </div>
    {/if}
</div>

<style>
    .wrapper{
        display: flex;
        flex-direction: column;

        gap: 2px;
        overflow-y: visible;
        overflow-x: hidden;
        padding: 4px 2px;
        min-height: 100%;
    }
    .empty-wrapper{
        position: relative;
        height: 100%;
    }
</style>