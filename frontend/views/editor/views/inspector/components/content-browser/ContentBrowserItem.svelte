<script>
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import TextureItem from "./TextureItem.svelte";
    import CodeItem from "./CodeItem.svelte";
    import ItemMetadata from "./ItemMetadata.svelte";
    import MaterialItem from "./MaterialItem.svelte";
    import MeshItem from "./MeshItem.svelte";
    import TerrainItem from "./TerrainItem.svelte";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import FILE_TYPES from "../../../../../../../static/objects/FILE_TYPES";
    import FS from "../../../../../../lib/FS/FS";

    const VALID = [FILE_TYPES.TEXTURE, FILE_TYPES.COLLECTION,  FILE_TYPES.MATERIAL, FILE_TYPES.TERRAIN]

    export let item
    let data
    let type
    $: fileType = "." + item.type
    $: {
        data = undefined
        if (fileType !== FILE_TYPES.PRIMITIVE && fileType !== FILE_TYPES.LEVEL) {
            const fType = VALID.includes(fileType) ? "json" : undefined
            FilesAPI.readFile(FS.ASSETS_PATH  + item.id, fType).then(res => data = res)
        } else
            data = undefined
    }

</script>

<div class="wrapper">

    <ItemMetadata item={item}/>
    <div data-sveltedivider="-" style="margin:0;"></div>
    {#if fileType === FILE_TYPES.TEXTURE && data != null}
        <TextureItem data={data} item={item}/>

    {:else if fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.UI_LAYOUT}
        <CodeItem data={data} item={item}/>
    {:else if data != null && (fileType === FILE_TYPES.MATERIAL)}
        <MaterialItem data={data} item={item}/>
    {:else if data != null && fileType === FILE_TYPES.TERRAIN}
        <TerrainItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.PRIMITIVE}
        <MeshItem item={item}/>
    {:else}
        <div class="empty-wrapper">
            <div data-svelteempty="-" style="position: relative">
                <Icon styles="font-size: 75px">category</Icon>
                {LOCALIZATION_EN.CONTENT_BROWSER}
            </div>
        </div>
    {/if}
</div>

<style>
    .wrapper {
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 4px 2px;
        min-height: 100%;
    }

    .empty-wrapper {
        position: relative;
        height: 100%;
    }
</style>